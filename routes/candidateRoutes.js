const express = require('express');
const router = express.Router();
const Candidate = require('./../models/candidate');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const User = require('../models/user');

//check for admin role
const isAdmin = async (userID) => {
    try {
        const user = await User.findById(userID)
        return user.role === 'admin';
    }
    catch (err) {
        return false;
    }
}


// POST route to add a user
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!await isAdmin(req.user.id))
            return res.status(403).json({ message: 'User has no admin role.' })

        const data = req.body // Assuming the request body contains the user data

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new person to the database
        const response = await newCandidate.save();
        console.log('data saved');

        res.status(200).json({ response: response });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//update Candidate data
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req.user.id))
            return res.status(403).json({ message: 'User has no admin role.' })

        const candidateID = req.params.candidateID; // Extract the id from the req.params
        const updatedData = req.body // Extract the data from req body
        const response = await Candidate.findByIdAndUpdate(candidateID, updatedData, {
            new: true, //return updated data
            runValidators: true //run mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//delete Candidate data
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req.user.id))
            return res.status(403).json({ message: 'User has no admin role.' })

        const candidateID = req.params.candidateID; // Extract the id from the req.params
        console.log(candidateID)
        const response = await Candidate.findByIdAndDelete(candidateID)
        console.log(response)
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/vote:candidateID', jwtAuthMiddleware, async (req, res) => {
    candidateID = req.params.candidateID;
    userID = req.user.id;

    try {
        //find candidate from candidate ID
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        //find user from user ID
        const user = await User.findById(candidateID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //check whether user has already voted
        if (user.hasVoted) {
            return res.status(400).json({ message: 'You have already voted.' });
        }

        //check if user is admin or not
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'You are a admin, and cant vote' });
        }

        //user has not voted and eligible to vote, voting logic

        //update candidate vote count 
        candidate.votes.push({ user: userID });
        candidate.voteCount++;
        await candidate.save()

        //update user.hasVoted to true
        user.hasVoted = true;
        await user.save()

        console.log('You have successfully voted.');
        res.status(200).json({ message: 'You have successfully voted.' });

    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

    //total vote counts get of candidate and arrange in descending order
    router.get('/votes', async (req, res) => {
        try {
            //find all candidates data in descending order by voteCount
            const candidates = await Candidate.find().sort({ voteCount: 'desc' });

            //map the candidates to only return candiate name, party and voteCount
            const voteData = candidates.map((data) => {
                return {
                    party: data.party,
                    count: data.voteCount
                }

            });
            return res.status(200).json(voteData);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });

        }


    })


module.exports = router;
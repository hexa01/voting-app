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
router.put('/:candidateID',jwtAuthMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req.user.id))
            return res.status(403).json({ message: 'User has no admin role.' })

        const candidateId = req.params.candidateID; // Extract the id from the req.params
        const updatedData = req.body // Extract the data from req body
        const response = await User.findByIdAndUpdate(candidateID, updatedData, {
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
router.delete('/:candidateID',jwtAuthMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req.user.id))
            return res.status(403).json({ message: 'User has no admin role.' })

        const candidateId = req.params.candidateID; // Extract the id from the req.params
        const response = await User.findByIdAndDelete(candidateID)

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
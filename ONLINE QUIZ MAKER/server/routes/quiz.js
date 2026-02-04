const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, questions } = req.body;
    console.log("Received Create Quiz Request:", { title, description, user: req.user._id });

    if (!questions || questions.length === 0) {
        return res.status(400).json({ message: 'Quiz must have at least one question' });
    }

    try {
        const quiz = new Quiz({
            title,
            description,
            questions,
            creator: req.user._id,
        });

        const createdQuiz = await quiz.save();
        res.status(201).json(createdQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}).populate('creator', 'username');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private (for taking it)
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).select('-questions.correctOptionIndex'); 
        // NOTE: We rely on a separate endpoint to grade, OR we send the whole thing if we trust client.
        // For security, strict apps hide correctOptionIndex. 
        // However, for immediate feedback UI logic sometimes it's easier to send it but only show after choice.
        // Let's hide it and calculate on backend for Submission.
        // BUT, if we want "Create" editing, we might need it.
        // For "Taking", we should hide it.
        // Let's return full quiz if creator, hidden if not?
        // For simplicity in this demo, sending it is risky but easier.
        // Implementing "submit" strategy:
        // 1. Client fetches Quiz (without answers).
        // 2. Client submits Answers.
        // 3. Server calculates and returns Score + Correct Answers.
        
        if (quiz) {
            res.json(quiz);
        } else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Submit a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
    const { answers } = req.body; // Array of selected indices [0, 2, 1...] matching questions order
    
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        
        // Simple logic: assume answers is index array.
        // answers[i] corresponds to quiz.questions[i]
        
        quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctOptionIndex) {
                score++;
            }
        });

        const result = new Result({
            user: req.user._id,
            quiz: quiz._id,
            score: score,
            totalQuestions: quiz.questions.length
        });

        await result.save();

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

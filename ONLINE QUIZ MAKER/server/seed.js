const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
    {
        username: 'quizmaster',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by model pre-save hook? No, passing directly to create might not trigger pre-save if using insertMany? Actually User.create triggers hooks.
    },
    {
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'password123',
    }
];

const quizzes = [
    {
        title: 'General Knowledge Trivia',
        description: 'Test your knowledge about the world with these random facts!',
        questions: [
            {
                questionText: 'What is the capital of France?',
                options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
                correctOptionIndex: 2
            },
            {
                questionText: 'Which planet is known as the Red Planet?',
                options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
                correctOptionIndex: 0
            },
            {
                questionText: 'Who wrote "Romeo and Juliet"?',
                options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
                correctOptionIndex: 1
            },
            {
                questionText: 'What is the largest ocean on Earth?',
                options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
                correctOptionIndex: 3
            }
        ]
    },
    {
        title: 'Science & Nature',
        description: 'A dedicated quiz for science lovers.',
        questions: [
            {
                questionText: 'What gas do plants absorb from the atmosphere?',
                options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
                correctOptionIndex: 1
            },
            {
                questionText: 'What is the chemical symbol for Gold?',
                options: ['Ag', 'Fe', 'Au', 'Pb'],
                correctOptionIndex: 2
            },
             {
                questionText: 'How many bones are in the adult human body?',
                options: ['206', '208', '201', '210'],
                correctOptionIndex: 0
            }
        ]
    },
    {
        title: 'History Buff',
        description: 'Travel back in time with these history questions.',
        questions: [
            {
                questionText: 'In which year did World War II end?',
                options: ['1940', '1942', '1945', '1950'],
                correctOptionIndex: 2
            },
            {
                questionText: 'Who was the first President of the United States?',
                options: ['Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams'],
                correctOptionIndex: 1
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Quiz.deleteMany({});
        console.log('Old data removed');

        // Create Users manually to ensure hashing works if using create
        // Or simply rely on the model. 
        // Note: insertMany does NOT trigger 'save' middleware usually.
        // So we loop.
        
        const createdUsers = [];
        for (const u of users) {
             const user = await User.create(u);
             createdUsers.push(user);
        }
        
        console.log(`Created ${createdUsers.length} users`);

        // Assign quizzes to the first user
        const creatorId = createdUsers[0]._id;

        const quizzesWithCreator = quizzes.map(q => ({ ...q, creator: creatorId }));
        
        await Quiz.insertMany(quizzesWithCreator);
        console.log(`Created ${quizzesWithCreator.length} quizzes`);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDB();

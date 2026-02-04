const axios = require('axios');

const verify = async () => {
    try {
        console.log("Fetching quizzes from API...");
        const res = await axios.get('http://localhost:5000/api/quizzes');
        
        if (res.data.length > 0) {
            console.log(`SUCCESS: Found ${res.data.length} quizzes in the database.`);
            res.data.forEach(q => {
                console.log(`- ${q.title} (${q.questions.length} questions)`);
            });
        } else {
            console.log("WARNING: No quizzes found. Database might be empty.");
        }
    } catch (error) {
        console.error("ERROR: Could not connect to API.", error.message);
    }
};

verify();

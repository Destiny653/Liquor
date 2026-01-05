const bcrypt = require('bcryptjs');

const password = 'wrongpassword';
const hash = '$2a$10$SomethingRandomThatIsNotThePassword';

bcrypt.compare(password, hash).then(res => {
    console.log('Result:', res);
});

const correctPassword = 'testpassword';
bcrypt.hash(correctPassword, 5).then(hashed => {
    console.log('Hashed:', hashed);
    bcrypt.compare(correctPassword, hashed).then(res2 => {
        console.log('Compare Correct:', res2);
    });
});

const bcrypt = require('bcrypt');

async function testPassword() {
    const hashedPassword = '$2b$10$C5IiypkKu1Pye.6W8EORIeagluuPA5lDOZsCAzzJiZxVvlGUSTlpi';
    const testPasswords = ['123456', 'password', 'lux', '666'];

    for (const password of testPasswords) {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log(`Password "${password}": ${isMatch ? '✅' : '❌'}`);
    }
}

testPassword(); 
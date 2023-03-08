const otpGenerator = require('otp-generator')


async function otpGenerate() {
    return await otpGenerator.generate(4, { digits:true,upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
}

module.exports = otpGenerate

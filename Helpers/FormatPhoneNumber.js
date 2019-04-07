
module.exports =  {
    formatNumber(number) {
        let prefix = '+234';
        let num = number.toString().replace(/\s+/, '');
        
        if (num.length <= 10 && num.startsWith('0')) {
            return prefix + num.slice(1)
        }
        else if (num.length <= 10) {
            return prefix + num
        }
        else if (num.startsWith('0')) {
            return prefix + num.slice(1)
        } 
        else if (num.startsWith('+234')) {
            return prefix + num.slice(4)
        } 
        else {
            return num
        };
    }
};

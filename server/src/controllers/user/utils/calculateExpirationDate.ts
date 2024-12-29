import ms from 'ms';

const calculateExpirationDate = (duration: string) => {
    const currentDateTime = new Date()
    const milliseconds = ms(duration)
    return (new Date(currentDateTime.getTime() + milliseconds)).toISOString()
}

export default calculateExpirationDate
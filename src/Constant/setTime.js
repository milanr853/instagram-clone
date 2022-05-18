
// for 1 minute
// const timeGap = 60000 

const timeGap = 86400000


const futureTime = (date) => {
    const countTime = new Date(date).getTime()
    const futureTime = new Date(countTime + timeGap).getTime()
    return futureTime
}


export default futureTime
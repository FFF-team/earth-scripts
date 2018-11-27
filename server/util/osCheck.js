const dealMem = (mem)=>{
    let G = 0,
        M = 0,
        KB = 0;
    (mem>(1<<30))&&(G=(mem/(1<<30)).toFixed(2));
    (mem>(1<<20))&&(mem<(1<<30))&&(M=(mem/(1<<20)).toFixed(2));
    (mem>(1<<10))&&(mem>(1<<20))&&(KB=(mem/(1<<10)).toFixed(2));
    return G>0?G+'G':M>0?M+'M':KB>0?KB+'KB':mem+'B';
};

const getNum = (str) => {
    let ret = str;
    if (str.indexOf('KB') >= 0) {
        ret = ret.slice(0, -2)
    } else {
        ret = ret.slice(0, -1)
    }

    return +ret
}

module.exports = ({maxMem = '500M'}) => {

    //内存
    // const totalMem = os.totalmem();
    // const freeMem = os.freemem();

    const _usedMem = dealMem(process.memoryUsage().rss);
    const _maxMem = maxMem;

    if (getNum(_usedMem) >= getNum(_maxMem)) {
        return _usedMem
    }

    return false

};







//cpu
// const cpus = os.cpus();
// console.log('*****cpu信息*******');
// cpus.forEach((cpu,idx,arr)=>{
//     var times = cpu.times;
//     console.log(`cpu${idx}：`);
//     console.log(`型号：${cpu.model}`);
//     console.log(`频率：${cpu.speed}MHz`);
//     console.log(`使用率：${((1-times.idle/(times.idle+times.user+times.nice+times.sys+times.irq))*100).toFixed(2)}%`);
// });

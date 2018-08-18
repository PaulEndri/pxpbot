export default class ResponseMessage {
    constructor(msg) {
        this.msg = msg;
    }

    send(content) {
        return new Promise((resolve, reject) => {
            let _response = content.join("\n");
            
            console.log(_response.length)
            if(_response.length < 2000) {
                this.msg.channel.send(_response);
            } else {
                let partCount  = Math.ceil(_response.length/1900);
                let resultSize = Math.ceil(content.length/partCount);
    
                for(let i = 0; i < partCount; i++) {
                    let chunk = content.slice(i*resultSize, (i*resultSize)+resultSize); 
                    let msg   = chunk.join("\n")

                    console.log(msg.length)

                    this.msg.channel.send(msg);
                }
            }

            resolve(content);
        })

    }
}
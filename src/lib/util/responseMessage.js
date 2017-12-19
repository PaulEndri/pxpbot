export default class ResponseMessage {
    constructor(msg) {
        this.msg = msg;
    }

    send(content) {
        return new Promise((resolve, reject) => {
            let _response = content.join("\n");
            
            if(_response.length < 2000) {
                this.message.channel.send(_response);
            } else {
                let partCount = Math.ceil(_response.length/2000);
                let resultSize = Math.ceil(content.length/partCount);
    
                for(let i = 0; i < partCount; i++) {
                    let chunk = content.slice(i*resultSize, (i*resultSize)+resultSize); 
                    
                    this.message.channel.send(chunk.join("\n"));
                }
            }

            resolve(content);
        })

    }
}
var path = require('path');
var fs = require('fs');
var chunks = [];
var p = function(e){
	return new Promise(function(resolve,reject){
		fs.readFile(e,function(err,data){
			resolve(data)
		})
	})
}

fs.readdir(path.join(__dirname),function(err,data){
	console.log(data);
	var arr = data.filter(function(e){
		if(e.indexOf('js')==-1){
			return true
		}
	});
	console.log(arr)
	// data.forEach(function(e){

	// })
	async function main(arr){
		for(let i of arr){
			let r =	await p(path.join(__dirname,i));
			chunks.push(r);
		}
	};
	main(arr).then(function(){
		// console.log(chunks)
		let totallength=0 ;
		for (let i of chunks){
			totallength+=i.length;
		}
		console.log(totallength);
		const bufA = Buffer.concat(chunks, totallength);
		console.log(bufA)
		fs.writeFile("./a.jpg",bufA,(err)=>{
			if(!err){
				console.log("ok")
			}
		})
		
	});
})
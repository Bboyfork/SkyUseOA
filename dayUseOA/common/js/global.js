 let global = { 
	isDev:true,
	addItem:function (obj,key,value){
		obj.key.unshift(value);
	},
	editItem:function(obj,key,index,value){
		obj.key[index] = value;
	},
	getDate:function (type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let date2;
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		} else if(type === 'weeked'){
			 date2 = new Date(date.getTime()+7* 24 * 3600 * 1000);
			 year = date2.getFullYear();
			 month = date2.getMonth() + 1;
			 day = date2.getDate();
		}
		month = month > 9 ? month : '0' + month;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	},
	//检验表单
	graceChecker:{
		error:'',
		check : function (data, rule){
			console.log(data)
			for(let i = 0; i < rule.length; i++){
				if (!rule[i].checkType){return true;}
				if (!rule[i].name) {return true;}
				if (!rule[i].errorMsg) {return true;}
				console.log(rule[i].name)
				console.log(data[rule[i].name])
				if (!data[rule[i].name].toString().trim()) {this.error = rule[i].errorMsg; return false;}
				switch (rule[i].checkType){
					case 'string':
						var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
						if(!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg; return false;}
					break;
					case 'int':
						var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
						if(!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg; return false;}
						break;
					break;
					case 'between':
						if (!this.isNumber(data[rule[i].name])){
							this.error = rule[i].errorMsg;
							return false;
						}
						var minMax = rule[i].checkRule.split(',');
						minMax[0] = Number(minMax[0]);
						minMax[1] = Number(minMax[1]);
						if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
							this.error = rule[i].errorMsg;
							return false;
						}
					break;
					case 'betweenD':
						var reg = /^-?[1-9][0-9]?$/;
						if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
						var minMax = rule[i].checkRule.split(',');
						minMax[0] = Number(minMax[0]);
						minMax[1] = Number(minMax[1]);
						if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
							this.error = rule[i].errorMsg;
							return false;
						}
					break;
					case 'betweenF': 
						var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
						if (!reg.test(data[rule[i].name])){this.error = rule[i].errorMsg; return false;}
						var minMax = rule[i].checkRule.split(',');
						minMax[0] = Number(minMax[0]);
						minMax[1] = Number(minMax[1]);
						if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
							this.error = rule[i].errorMsg;
							return false;
						}
					break;
					case 'same':
						if (data[rule[i].name] != rule[i].checkRule) { this.error = rule[i].errorMsg; return false;}
					break;
					case 'notsame':
						if (data[rule[i].name] == rule[i].checkRule) { this.error = rule[i].errorMsg; return false; }
					break;
					case 'email':
						var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
						if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
					break;
					case 'phone':
						var reg = /^1[3456789]\d{9}$/;
						if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
					break;
					case 'zipcode':
						var reg = /^[0-9]{6}$/;
						if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
					break;
					case 'reg':
						var reg = new RegExp(rule[i].checkRule);
						if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
					break;
					case 'in':
						if(rule[i].checkRule.indexOf(data[rule[i].name]) == -1){
							this.error = rule[i].errorMsg; return false;
						}
					break;
					case 'date':
						if(rule[i].checkRule == data[rule[i].name]){
							this.error = rule[i].errorMsg; return false;
						}
					break;
					case 'notnull':
						if(data[rule[i].name] == null || data[rule[i].name].length < 1){this.error = rule[i].errorMsg; return false;}
					break;
				}
			}
			return true;
		},
		isNumber : function (checkVal){
			var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
			return reg.test(checkVal);
		}
	}
};

global.url = global.isDev ? 'http://192.168.1.125:8082/TestCon' : 'http://192.168.1.100:8082/TestCon';
//体验版 版本  http://192.168.1.100:8082/TestCon    //开发版  http://192.168.1.11/skyuseWindows
export default global; 
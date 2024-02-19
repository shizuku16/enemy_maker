var i=1
var attack=[0,1]

function previewImage(obj){
    const fileReader = new FileReader();
    fileReader.onload = (function() {
        document.getElementById('preview').src = fileReader.result;
    });
    fileReader.readAsDataURL(obj.files[0]);
}

function add(){
    i++
    let adding=`<tr id="r${i}"><td><input type="text" style="width:60px;" id="bui${i}"></td><td><input type="number" id="hp${i}"></td><td><input type="number" id="mp${i}"></td><td><input type="number" id="kaihi${i}"></td><td><input type="number" id="protection${i}"></td><td><input type="number" id="mpprotection${i}"></td><td id="h${i}"><input type="number" id="hit${i}1"></td><td id="n${i}"><input type="text" style="width:90px;" id="attackname${i}1"></td><td id="d${i}"><input type="text" style="width:100px;" id="damage${i}1"><td><button onclick="attackadd(${i})">＋</button><br><button onclick="attackreduce(${i})">－</button></td></tr>`;
    const table=document.getElementById("status");
    table.insertAdjacentHTML("beforeend",adding);
    attack.push(1);
}
function reduce() {
    const r=document.getElementById("r"+i)
    r.remove()
    i--
    attack.pop()
}

function attackadd(k) {
    attack[k]=attack[k]+1;
    const h=document.getElementById("h"+k);
    const d=document.getElementById("d"+k);
    const n=document.getElementById("n"+k);
    const addh="<div><input type=\"number\" id=\"hit"+String(k)+attack[k]+"\"><\div>";
    const addd="<div><input type=\"text\" style=\"width:100px;\" id=\"damage"+String(k)+attack[k]+"\"><\div>";
    const addn="<div><input type=\"text\" style=\"width:90px;\" id=\"attackname"+String(k)+attack[k]+"\"><\div>";

    h.insertAdjacentHTML("beforeend",addh);
    d.insertAdjacentHTML("beforeend",addd);
    n.insertAdjacentHTML("beforeend",addn);
}
function attackreduce(k) {
    const h=document.getElementById("hit"+String(k)+attack[k]);
    const d=document.getElementById("damage"+String(k)+attack[k]);
    const n=document.getElementById("attackname"+String(k)+attack[k]);
    if(attack[k]==1) return
    let check=true
    if(h.value||d.value||n.value) check=window.confirm("値が入っていますが削除しますか？");
    if(!check) return
    h.remove();
    d.remove();
    n.remove();
    attack[k]=attack[k]-1;
}

async function load() {
    const image=document.getElementById("image");
    if(image.files[0]){
    await image.files[0].arrayBuffer().then((arraybuffer) => {
        const sha = new jsSHA("SHA-256", 'ARRAYBUFFER');
        sha.update(arraybuffer);
        const hash = sha.getHash("HEX");
        return hash
    })
    .then((hash)=>make(hash))
}else{make("")}
}

function make(image){
    let name=document.getElementById("name").value;
    let mind=document.getElementById("mind").value;
    let life=document.getElementById("life").value;

    let writeString="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<character location.name=\"table\" posZ=\"0\" isLock=\"false\" rotate=\"0\" roll=\"0\" hideInventory=\"false\" nonTalkFlag=\"false\" overViewWidth=\"270\" overViewMaxHeight=\"250\" specifyKomaImageFlag=\"false\" komaImageHeignt=\"100\" chatColorCode.0=\"#000000\" chatColorCode.1=\"#FF0000\" chatColorCode.2=\"#0099FF\" syncDummyCounter=\"0\">\n  <data name=\"character\">\n    <data name=\"image\">\n      <data type=\"image\" name=\"imageIdentifier\">"+image+"</data>\n    </data>\n    <data name=\"common\">\n      <data name=\"name\">"+name+"</data>\n      <data name=\"size\">1</data>\n    </data>\n    <data name=\"detail\">\n      <data name=\"リソース\">\n";

    if(i==1){
        const hp=document.getElementById("hp1").value;
        const mp=document.getElementById("mp1").value;
        const protection=document.getElementById("protection1").value;
        const mpprotection=document.getElementById("mpprotection1").value;
        if(hp!="")writeString+="          <data name=\"HP\" type=\"numberResource\" currentValue=\""+hp+"\">"+hp+"</data>\n";
        if(mp!="")writeString+="          <data name=\"MP\" type=\"numberResource\" currentValue=\""+mp+"\">"+mp+"</data>\n";
        writeString+=`          <data name="防護点" type="numberResource" currentValue="${protection}">${protection}</data>\n`;
        if(mpprotection!=""&&mpprotection!="0")
            writeString+=`          <data name="マナ耐性" type="numberResource" currentValue="${mpprotection}">${mpprotection}</data>\n`;
    }
    else{
        for(let j=1;j<=i;j++){
            const bui=document.getElementById("bui"+j).value||"部位"+j;
            const hp=document.getElementById("hp"+j).value;
            const mp=document.getElementById("mp"+j).value;
            const protection=document.getElementById("protection"+j).value;
            const mpprotection=document.getElementById("mpprotection"+j).value;

            writeString+="        <data name=\""+bui+"\">\n";
            if(hp!="")writeString+=`          <data name="HP(${bui})" type="numberResource" currentValue="${hp}">${hp}</data>\n`;
            if(mp!="")writeString+=`          <data name="MP(${bui})" type="numberResource" currentValue="${mp}">${mp}</data>\n`;
            if(protection!="")writeString+=`          <data name="防護点(${bui})" type="numberResource" currentValue="${protection}">${protection}</data>\n`;
            if(mpprotection!=""&&mpprotection!="0")
                writeString+=`          <data name="マナ耐性(${bui})" type="numberResource" currentValue="${mpprotection}">${mpprotection}</data>\n`;
            writeString+="        </data>\n";
        }
    }
    
    writeString+="      </data>\n    </data>\n  </data>\n  <chat-palette dicebot=\"SwordWorld2.5\">\n";
    writeString+=`2d6+${mind}　【精神抵抗】\n2d6+${life}　【生命抵抗】\n\n`;
    
    for(let j=1;j<=i;j++){
        let bui=document.getElementById("bui"+j).value||"部位"+j;
        const mpprotection=document.getElementById("mpprotection"+j).value;
        const mpdec = mpprotection!=""&&mpprotection!="0" ? `+${mpprotection}` : "";
        if(i==1) bui="";
        else writeString+="["+bui+"]\n";
        writeString+=`:HP(${bui})+{防護点(${bui})}-　【物理ダメージ】\n:HP(${bui})${mpdec}-　【魔法ダメージ】\n:MP(${bui})-　【MP減少】\n\n`;
        for(let m=1;m<=attack[j];m++){
            let hit=document.getElementById("hit"+String(j)+m).value;
            let damage=document.getElementById("damage"+String(j)+m).value;
            let attackname=document.getElementById("attackname"+String(j)+m).value;
            if(hit=="" && damage=="" && attackname=="") continue;
            if(hit!="") writeString+="2d6+"+hit;
            if(attackname!="")writeString+="　【"+attackname+"行使】\n";
            else writeString+="　【命中・魔法行使】\n";
            if(damage!=""){
                if(damage.match(/^\d+$/i)) writeString+="2d6+"+damage+"　【";
                else writeString+=damage+"　【";
                if(attackname!="") writeString+=attackname;
                writeString+="ダメージ】\n";
            }
        }
        let kaihi=document.getElementById("kaihi"+j).value
        if(kaihi!="")writeString+="2d6+"+kaihi+"　【回避】\n\n"
    }
    writeString+="</chat-palette>\n</character>";
    writeString=writeString.replace(/\(\)/g,"");
    download(writeString)
}

function download(writeString){
    var zip = new JSZip();
    var image=document.getElementById("image").files[0]
    var name=document.getElementById("name").value
    zip.file("test.xml", writeString);
    zip.file("image.png",image)
    zip.generateAsync({type:'blob'})
    .then(function(content) {
            //ダウンロード用にリンクを作成する
            const download = document.createElement('a');
            //リンク先に上記で生成したURLを指定する
            download.href = URL.createObjectURL(content);
            //download属性にファイル名を指定する
            download.download = name+'.zip';
            //作成したリンクをクリックしてダウンロードを実行する
            download.click();
            //createObjectURLで作成したオブジェクトURLを開放する
            (window.URL || window.webkitURL).revokeObjectURL(url);})
}
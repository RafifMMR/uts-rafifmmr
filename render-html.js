var http = require("http")
var url = require("url")
var fs = require("fs")
var qs = require("querystring")

var renderCategories = fs.readFileSync("./pages/categories.html");
var renderCourses = fs.readFileSync("./pages/courses.html");
var renderProfil = fs.readFileSync("./pages/profil.html");
var renderHasil = fs.readFileSync("./pages/hasil.html");

function css(request, response) {
    if (request.url === "/style.css") {
        response.writeHead(200, { "Content-type": "text/css" });
        var fileContents = fs.readFileSync("./style.css", { encoding: "utf8" });
        response.write(fileContents);
        response.end();
    }
}

var server = http.createServer(function(request,response){
    css(request, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    var q = url.parse(request.url,true)
    if (q.pathname == "/" && request.method == "GET"){
        var keyword = q.query.keyword;
        if (keyword){
            fs.readFile("./pages/search.html", (error, data) => {
                if (error) {
                    response.writeHead(404,{"Conten-Type": "text/html"});
                    response.end("404 Not Found");
                } else {
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data)
                    response.write("<h2 style='text-align: center;'>Pencarian</h2>");
                    response.write("<p style='text-align: center;'>Anda Mencari : <b>" + keyword + "</b> </p>");
                    response.write("<h3 style='text-align: center;'><b></b>Tidak ada Hasil ! Maaf Website ini masih dalam tahap pengembangan</b></h3>");
                    return response.end()
                }
            });
            }
        else{
            fs.readFile("./pages/index.html",function(error,data){
                if (error){
                    response.writeHead(404,{"Conten-Type": "text/html"});
                    response.end("404 Not Found");
                }
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(data)
            response.end();    
            });
        }
    }
    else if (request.url == '/categories'){
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(renderCategories);
        response.end();
    }
    else if (request.url == '/courses'){
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(renderCourses);
        response.end();
    }
    else if (request.url==="/login" && request.method === "GET"){
        fs.readFile("./pages/login.html",(error,data)=>{
            if (error){
                response.writeHead(404,{"Content-Type":"text/html"});
                return response.end("404 Server Not Found");                
            }
            else{
                response.writeHead(200, {"Content-Type":"text/html"});
                response.write(data)
                return response.end()
            }
        });
    }
    else if (request.url==="/login" && request.method === "POST"){
        var requestBody = "";
        request.on("data",function(data){
            requestBody += data;
        });
        request.on("end",function(){
            var formData = qs.parse(requestBody);
            if (formData.username === "rafifmmr" && formData.password === "1121102011"){
                response.writeHead(200,{"Content-Type":"text/html"});
                response.end(renderProfil);
                }
            else{
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write("<h2>Login Gagal</h2>");
                response.write("<a href='/login'>Coba Kembali</a>");
                response.end();
            }
        });
    }
    else if (request.url==="/daftar" && request.method === "GET"){
        fs.readFile("./pages/daftar.html",(error,data) => {
            if (error){
                response.writeHead(404,{"Content-Type":"text/html"});
                return response.end("404 Server Not Found");                
            }
            else{
                response.writeHead(200, {"Content-Type":"text/html"});
                response.write(data)
                return response.end()
            }
        });
    }
    else if (request.url==="/daftar" && request.method === "POST"){ 
        
        var requestReg = "";
        request.on("data",function(data) {
            requestReg += data;
        });
        request.on("end",function(){
            var formData = qs.parse(requestReg);
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(renderHasil)
            response.write('<div class="center-text">' +
            '<h5>Anda Berhasil Mendaftar Sebagai : </h5>' +
            '</div>');
            response.write('<center>'+
            '<table class="box">'+
            '<tr>'+
                '<th>'+
                    'Nama '+
                '</th>'+            
                '<td>'+
                    ': '+formData['username'] +
                '</td>'+
    
            '</tr>'+
            '<tr>'+
                '<th>'+
                    'Username '+
                '</th>'+            
                '<td>'+
                    ': '+formData['email']+
                '</td>'+
    
            '</tr>'+
            '<tr>'+
                '<th>'+
                    'Email '+
                '</th>'+            
                '<td>'+
                    ': '+formData['password']+
                '</td>'+
    
            '</tr>'+
            '<tr>'+
                '<th>'+
                    'No. Telepon '+
                '</th>'+            
                '<td>'+
                    ': '+formData['telepon']+
                '</td>'+
    
            '</tr>'+
            
            '</table>'+
            '</center>'
            );
            response.end()
        });
    }
});

server.listen(process.env.PORT || 5000);
console.log("server Berjalan")

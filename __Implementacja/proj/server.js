if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const { MongoClient } = require('mongodb')
const port = 5500



const initializePassport = require('./passport-config')
const { ObjectID } = require('mongodb')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

async function findUsers() {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('users').find().toArray()//One( { nickname: 'admin' })
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findUser(id) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('users').findOne({ _id: id})
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function createUserDB(nickname, password, role) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await createUser(client, {
            nickname: nickname,
            password: password,
            role: role
        })
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function createUser(client, newListing) {
    const result = await client.db("ProjectingSupport").collection("users").insertOne(newListing);

    const repair = await client.db("ProjectingSupport").collection("users").updateOne(
        { _id: result.insertedId},
        { $set: { "id": result.insertedId.toString() } }
    )

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function deleteUserDB(id) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        await deleteUser(client, id)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function deleteUser(client, newListing){
    const result = await client.db("ProjectingSupport").collection("users").deleteOne({ "_id": newListing })
   // console.log(`${result.deletedCount} documents were deleted`)
}
async function editUserDB(id, newNickname, /*newPassword,*/ newRole) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await editUser(client, id, newNickname, /*newPassword,*/ newRole)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function editUser(client, id, newNickname, /*newPassword,*/ newRole) {
    const result = await client.db("ProjectingSupport").collection("users").updateOne(
        { _id: id },
        { $set: {
            "nickname": newNickname,
            //"password": newPassword,
            "role": newRole
        }}
    );

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function editUserPasswordDB(id, newPassword) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await editUserPassword(client, id, newPassword)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function editUserPassword(client, id, newPassword) {
    const result = await client.db("ProjectingSupport").collection("users").updateOne(
        { _id: id },
        { $set: {
            "password": newPassword
        }}
    );

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}
/////////////////////////////////////////////////////////////////////////////
async function findProjects() {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('projects').find().toArray()
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findProject(id) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('projects').findOne({ _id: id})
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findProjectsOfUser(userNickname) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var issuesOfUser = await client.db('ProjectingSupport').collection('issues')
        .find({issueNickname: userNickname})
        .toArray()
        var projectNamesOfUser = []
        issuesOfUser.forEach(issue => {
            projectNamesOfUser.push(issue.projectName)
        });
        var amount = projectNamesOfUser.length
        var uniqueProjectNameOfUsers = []
        for (let i = 0; i < amount; i++) {
            var isOk = true;
            for (let j = i + 1; j < amount; j++) {
                if(projectNamesOfUser[i] == projectNamesOfUser[j]){
                    isOk = false
                }
            }
            if(isOk) { uniqueProjectNameOfUsers.push(projectNamesOfUser[i]) }
        }
        var result = []

        for (let i = 0; i < uniqueProjectNameOfUsers.length; i++) {
            var element = await client.db('ProjectingSupport').collection('projects')
            .findOne({projectName: uniqueProjectNameOfUsers[i]})
            // var element = { 'projectName': uniqueProjectNameOfUsers[i]}
            result.push(element)
        }
        return result

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function createProjectDB(projectName) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await createProject(client, {
            projectName: projectName
        })
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function createProject(client, newListing) {
    const result = await client.db("ProjectingSupport").collection("projects").insertOne(newListing);

    const repair = await client.db("ProjectingSupport").collection("projects").updateOne(
        { _id: result.insertedId},
        { $set: { "id": result.insertedId.toString() } }
    )

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function deleteProjectDB(id) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        await deleteProject(client, id)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function deleteProject(client, newListing){
    const result = await client.db("ProjectingSupport").collection("projects").deleteOne({ "_id": newListing })
   // console.log(`${result.deletedCount} documents were deleted`)
}
async function editProjectDB(id, newProjectName) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await editProject(client, id, newProjectName)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function editProject(client, id, newProjectName) {
    const result = await client.db("ProjectingSupport").collection("projects").updateOne(
        { _id: id },
        { $set: { "projectName": newProjectName }}
    );

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}
/////////////////////////////////////////////////////////////////////////////
async function findIssues() {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('issues').find().toArray()
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findIssue(id) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('issues').findOne({ _id: id})
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findIssuesOfProject(projectName) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var result = await client.db('ProjectingSupport').collection('issues').find({ projectName: projectName }).toArray()
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findIssuesOfUserProjectNames(userNickname) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        var issuesOfUser = await client.db('ProjectingSupport').collection('issues')
        .find({issueNickname: userNickname})
        .toArray()
        var projectNamesOfUser = []
        issuesOfUser.forEach(issue => {
            projectNamesOfUser.push(issue.projectName)
        });
        var amount = projectNamesOfUser.length
        var uniqueProjectNameOfUsers = []
        for (let i = 0; i < amount; i++) {
            var isOk = true;
            for (let j = i + 1; j < amount; j++) {
                if(projectNamesOfUser[i] == projectNamesOfUser[j]){
                    isOk = false
                }
            }
            if(isOk) { uniqueProjectNameOfUsers.push(projectNamesOfUser[i]) }
        }
        var result = []
        var issuesOfProject = []
        
        for (let i = 0; i < uniqueProjectNameOfUsers.length; i++) {
            issuesOfProject = await client.db('ProjectingSupport').collection('issues')
            .find({projectName: uniqueProjectNameOfUsers[i]})
            .toArray()

            issuesOfProject.forEach(element1 => {
                result.push(element1)
            });
        }
        return result
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function createIssueDB(projectName, issueName, issueStatus, issueNickname) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await createIssue(client, {
            projectName: projectName,
            issueName: issueName,
            issueStatus: issueStatus,
            issueNickname: issueNickname
        })
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function createIssue(client, newListing) {
    const result = await client.db("ProjectingSupport").collection("issues").insertOne(newListing);

    const repair = await client.db("ProjectingSupport").collection("issues").updateOne(
        { _id: result.insertedId},
        { $set: { "id": result.insertedId.toString() } }
    )

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function deleteIssueDB(id) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        await deleteIssue(client, id)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function deleteIssue(client, newListing){
    const result = await client.db("ProjectingSupport").collection("issues").deleteOne({ "_id": newListing })
   // console.log(`${result.deletedCount} documents were deleted`)
}
async function editIssueDB(id, newProjectName, newIssueName, newIssueStatus, newIssueNickname) {
    const uri = "mongodb+srv://admin:sdfoijj@cluster0.b1rl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect();
        await editIssue(client, id, newProjectName, newIssueName, newIssueStatus, newIssueNickname)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function editIssue(client, id, newProjectName, newIssueName, newIssueStatus, newIssueNickname) {
    const result = await client.db("ProjectingSupport").collection("issues").updateOne(
        { _id: id },
        { $set: {
            "projectName": newProjectName,
            "issueName": newIssueName,
            "issueStatus": newIssueStatus,
            "issueNickname": newIssueNickname }}
    );

    //console.log(`New listing created with the following id: ${result.insertedId}`);
}

//========================   ISSUE MANAGEMENT   ===============================
app.get('/issues', checkAuthenticated, (req, res) =>{
    if (req.user.role != "User"){
        findIssues().then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    } else {        
        findIssuesOfUserProjectNames(req.user.nickname).then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    }
})
app.get('/addIssue', checkAuthenticated, (req, res) =>{
    if (req.user.role != "User"){
        findProjects().then(projects => {
            findUsers().then(users => {
                res.render('addIssue.ejs', { 'projects': projects, 'users': users, 'nickname': req.user.nickname })
            })
        })
    } else {
        findProjectsOfUser(req.user.nickname).then(projects => {
            findUsers().then(users => {
                var users1 = [ {'nickname': req.user.nickname} ]
                res.render('addIssue.ejs', { 'projects': projects, 'users': users1, 'nickname': req.user.nickname })
            })
        })
    }
})
app.post('/addIssue', checkAuthenticated, async(req, res) => {
    
    console.log(req.body)
    try {
        await createIssueDB(req.body.projectName, req.body.issueName, req.body.issueStatus, req.body.issueNickname);
    } catch(e) { console.log(e) }
    // findProjects().then(projects => {
    //     findUsers().then(users => {
    //         res.render('addIssue.ejs', { 'projects': projects, 'users': users, 'nickname': req.user.nickname })
    //     })
    // })
    if (req.user.role != "User"){
        findIssues().then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    } else {
        findIssuesOfUserProjectNames(req.user.nickname).then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    }
    
})
app.get('/deletingIssue', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);

    await deleteIssueDB(id)

    if (req.user.role != "User"){
        findIssues().then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    } else {
        findIssuesOfUserProjectNames(req.user.nickname).then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    }
})
app.get('/editIssue', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);
    
    if (req.user.role != "User"){
        findProjects().then(projects => {
            findUsers().then(users => {
                findIssue(id).then(issue => {
                    var projectName = issue.projectName
                    var issueName = issue.issueName
                    var issueStatus = issue.issueStatus
                    var issueNickname = issue.issueNickname
                    res.render('editIssue.ejs', { 'id': id, 'projectName': projectName, 'issueName': issueName, 'issueStatus': issueStatus, 'issueNickname': issueNickname, 'projects': projects, 'users': users, 'nickname': req.user.nickname })
                })
            })
        })
    } else {
        findProjectsOfUser(req.user.nickname).then(projects => {
            findUsers().then(users => {
                var users1 = [ {'nickname': req.user.nickname} ]
                findIssue(id).then(issue => {
                    var projectName = issue.projectName
                    var issueName = issue.issueName
                    var issueStatus = issue.issueStatus
                    var issueNickname = issue.issueNickname
                    res.render('editIssue.ejs', { 'id': id, 'projectName': projectName, 'issueName': issueName, 'issueStatus': issueStatus, 'issueNickname': issueNickname, 'projects': projects, 'users': users1, 'nickname': req.user.nickname })
                })
            })
        })
    }
})
app.post('/editIssue', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);
    try {
        await editIssueDB(id, req.body.projectName, req.body.issueName, req.body.issueStatus, req.body.issueNickname);
    } catch(e) { console.log(e) }
    findIssues().then(issues => {
        res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
    })
})
/////////////////////////   ISSUE MANAGEMENT   ////////////////////////////////
//========================   PROJECT MANAGEMENT   ===============================
app.get('/projects', checkAuthenticated, (req, res) =>{
    if (req.user.role != "User"){
        findProjects().then(projects => {
            res.render('projects.ejs', { 'projects': projects, 'nickname': req.user.nickname})
        })
    } else {
        findProjectsOfUser(req.user.nickname).then(projects => {
            res.render('projects.ejs', { 'projects': projects, 'nickname': req.user.nickname})
        })
    }
})
app.get('/addProject', checkAuthenticated, (req, res) =>{
    if (req.user.role != "User"){
        res.render('addProject.ejs', { 'nickname': req.user.nickname })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
app.post('/addProject', checkAuthenticated, async(req, res) => {
    try {
        await createProjectDB(req.body.projectName);
    } catch(e) { console.log(e) }
    res.render('addProject.ejs', { nickname: req.user.nickname })
    // findProjects().then(projects => {
    //     res.render('projects.ejs', { 'projects': projects, 'nickname': req.user.nickname})
    // })
})
app.get('/deletingProject', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);

    if (req.user.role != "User"){
        /*await*/ deleteProjectDB(id)

        findProjects().then(projects => {
            res.render('projects.ejs', { 'projects': projects, 'nickname': req.user.nickname})
        })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
    
})
app.get('/editProject', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);
    if (req.user.role != "User"){
        findProject(id).then(project => {
            var projectName = project.projectName
            res.render('editProject.ejs', { 'id': id, 'projectName': projectName, 'nickname': req.user.nickname })
        })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
    
})
app.post('/editProject', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);
    try {
        await editProjectDB(id, req.body.projectName);
    } catch(e) { console.log(e) }
    findProjects().then(projects => {
        res.render('projects.ejs', { 'projects': projects, 'nickname': req.user.nickname})
    })
})
app.get('/showIssues', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);

    findProject(id).then(project => {
        var projectName = project.projectName
        findIssuesOfProject(projectName).then(issues => {
            res.render('issues.ejs', { 'issues': issues, 'nickname': req.user.nickname})
        })
    })
})
/////////////////////////   PROJECT MANAGEMENT   ////////////////////////////////
//======================  USER MANAGEMENT =========================================
app.get('/users', checkAuthenticated, (req, res) =>{
    if (req.user.role != "User"){
        findUsers().then(users => {
            res.render('users.ejs', { 'users': users, 'nickname': req.user.nickname})
        })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
app.get('/addUser', checkAuthenticated, (req, res) =>{
    if (req.user.role == "Admin"){
        res.render('addUser.ejs', { 'nickname': req.user.nickname })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
app.post('/addUser', checkAuthenticated, async(req, res) => {
    if (req.user.role == "Admin"){
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await createUserDB(req.body.nickname, hashedPassword, req.body.role);
        } catch(e) { console.log(e) }
        //res.render('addUser.ejs', { nickname: req.user.nickname })
        findUsers().then(users => {
            res.render('users.ejs', { 'users': users, 'nickname': req.user.nickname})
        })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
app.get('/deletingUser', checkAuthenticated, async(req, res) =>{
    if (req.user.role == "Admin"){
        var id = new ObjectID(req.query.id);

        /*await*/ deleteUserDB(id)

        findUsers().then(users => {
            res.render('users.ejs', { 'users': users, 'nickname': req.user.nickname})
    })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
app.get('/editUser', checkAuthenticated, async(req, res) =>{
    if (req.user.role != "User"){
        var id = new ObjectID(req.query.id);
    
        findUser(id).then(user => {
            var userNickname = user.nickname
            var password = user.password
            var role = user.role
            res.render('editUser.ejs', { 'id': id, 'userNickname': userNickname, 'password': password, 'role': role, 'nickname': req.user.nickname })
        })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
app.post('/editUser', checkAuthenticated, async(req, res) =>{
    if (req.user.role != "User"){
        var id = new ObjectID(req.query.id);
    
        var id = new ObjectID(req.query.id);
        try {
            await editUserDB(id, req.body.nickname, /*req.body.password,*/ req.body.role);
        } catch(e) { console.log(e) }
        findUsers().then(users => {
            res.render('users.ejs', { 'users': users, 'nickname': req.user.nickname})
        })
    } else {
        res.render('lackOfPermission.ejs', { nickname: req.user.nickname })
    }
})
////////////////////// USER MANAGEMENT /////////////////////////////////////////////
//================== LOGOWANIE I AUTORYZACJA ==============================
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { nickname: req.user.nickname })
})
app.get('/login', checkNotAuthenticated, (req, res) => {
    findUsers().then(users => {
        initializePassport(
            passport,
            nickname => users.find(user => user.nickname === nickname),
            id => users.find(user => user.id === id)
        )
    })
    res.render('login.ejs')
})
app.post('/login', checkNotAuthenticated,
passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
app.post('/changePassword', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.user.id);
    
    findUser(id).then(user => {

        var userNickname = user.nickname
        var password = user.password
        var role = user.role
        res.render('changePassword.ejs', { 'id': id, 'userNickname': userNickname, 'password': password, 'role': role, 'nickname': req.user.nickname })
    })
})
app.post('/changePasswordApprove', checkAuthenticated, async(req, res) =>{
    var id = new ObjectID(req.query.id);
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await editUserPasswordDB(id, hashedPassword);
    } catch(e) { console.log(e) }
    findUsers().then(users => {
        res.render('users.ejs', { 'users': users, 'nickname': req.user.nickname})
    })
})
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
/////////////////////// LOGOWANIE I AUTORYZACJA ////////////////////////////////////



app.listen(port, () => console.log(`Listenning port ${port}...`))

module.exports = findUsers
/**
 * Created by hui on 2016-10-16.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://127.0.0.1:27017/movie');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'publics')));
app.listen(port);

console.log('movie started on '+port )

// index page
app.get('/',function (req,res) {
  Movie.fetch(function (err,movies) {
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'首页',
      movies:movies
    })

  })


})

// list page
app.get('/admin/list',function (req,res) {
  Movie.fetch(function (err,movies) {
    console.log(movies)
    if(err){
      console.log(err);
    }
    res.render('list',{
      title:'电影列表',
      movies:movies
    })
  })

})

// detail page
app.get('/movie/:id',function (req,res) {
  var id = req.params.id;
  Movie.findById(id,function (err,movie) {
    //console.log(movie)
    res.render('detail',{
      title:'电影详情',
      movie:movie
    })
  })


})

// admin page
app.get('/admin/movie',function (req,res) {
  res.render('admin',{
    title:'后台管理-新增',
    movie:{
      title:'',
      doctor:"",
      country:"",
      year:"",
      poster:"",
      flash:"",
      summary:"",
      language:""
    }
  })
})

//admin update movie
app.get('/admin/update/:id',function (req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function (err,movie) {
      console.log(movie)
      res.render('admin',{
        title: '后台管理-更新',
        movie: movie
      })
    })
  }
})

//admin post movie
app.post('/admin/movie/new',function (req,res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if(id != 'undefined'){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err);
      }
      _movie=_.extend(movie,movieObj);
      _movie.save(function (err,movie) {
        if(err){
          console.log(err);
        }
        res.redirect("/movie/"+movie._id);
      })
    })
  }else{
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    _movie.save(function (err,movie) {
      if(err){
        console.log(err);
      }
      res.redirect("/movie/"+movie._id);
    })
  }
})

//删除
app.delete('/admin/deleteById',function (req,res) {
  var id = req.query.id;
  console.log('id='+id)
  if(id){
    Movie.remove({_id:id},function (err,movie) {
      if(err){
        console.log(err);
      }else{
        res.json({'success':'1'})
      }
    })
  }

})

var Movie = require('../models/movie');
var _ = require('underscore');
// list page
exports.list=function (req,res) {
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

}

// detail page
exports.detail=function (req,res) {
    var id = req.params.id;
    Movie.findById(id,function (err,movie) {
        //console.log(movie)
        res.render('detail',{
            title:'电影详情',
            movie:movie
        })
    })


}

// admin page
exports.new=function (req,res) {
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
}

//admin update movie
exports.update=function (req,res) {
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
}

//admin post movie save
exports.save=function (req,res) {
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
}

//删除
exports.del=function (req,res) {
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

}
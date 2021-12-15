const express = require('express')
const router = express.Router()
const Category = require('../models/category')


/*
Get Category index
*/

router.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if (err) return console.log(err)
        res.render('admin/categories', {
            categories: categories
        })
    })
})

/*
Get add category
*/
router.get('/add-category', function (req, res) {
    var title = "";
    res.render('/admin/add_category', {
        title: title
    })
})

/*
POST add categories
*/
router.post('/add-category', function (req, res) {
    req.checkBody("title", 'Title must have a value.').notEmpty();
    var title = req.body.title
    var slug = title.replace(/\s+/g, '-').toLowerCase()

    var errors = req.validationErrors()

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title
        })
    }
    else {
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                req.flash('danger', 'category slug exist, choose another.')
                res.render('admin/add_category', {
                    errors: errors,
                    title: title
                })

            }
            else {
                var category = new Category({
                    title: title,
                    slug: slug
                })
                category.save(function (err) {
                    if (err) console.log(err)

                    req.flash('Success!', 'Category Added!')
                    res.redirect('/admin/categories')
                })
            }
        })
    }


})

/*
Get edit category
*/
/// have error and css of admin_categories
router.get('admin/edit-category/:id', function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) return console.log(err)

        res.render('/admin/edit_category/', {
            title: category.title,
            id: category._id
        })
    }
    )

})

/*
POST edit category
*/
router.post('/edit-category/:id', function (req, res) {
    req.checkBody("title", 'Title must have a value.').notEmpty();
    var title = req.body.title
    var slug = title.replace(/\s+/g, '-').toLowerCase()
    var id = req.params.id

    var errors = req.validationErrors()

    if (errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            id: id
        })
    }
    else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
            if (category) {
                req.flash('danger', 'category title exist, choose another.')
                res.render('admin/edit_category', {
                    errors: errors,
                    title: title,
                    id: id
                })

            }
            else {
                Category.findById(id, function (err, category) {
                    if (err) console.log(err)

                    category.title = title
                    page.slug = slug
                    category.save(function (err) {
                        if (err) console.log(err)

                        req.flash('Success!', 'category edited!')
                        res.redirect('/admin/categories/edit_category/' + id)
                    })
                })

            }
        })
    }

})

////////////

/*
Get delete category 
*/

router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) console.log(err)

        req.flash('Success!', 'category deleted!')
        res.redirect('/admin/categories/')

    });

});


//exports
module.exports = router

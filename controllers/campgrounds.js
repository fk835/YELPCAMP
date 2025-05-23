const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
// map-tiler
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.renderNewForm = (req, res)=>{
  res.render('campgrounds/new')
}

module.exports.saveNew = async(req, res, next)=>{
  // map-tiler
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;

  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename}))
  campground.author = req.user._id
  await campground.save()
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`campgrounds/${campground._id}`)

}

module.exports.showAll = async (req, res, next)=>{
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
}

module.exports.show = async(req, res, next)=>{
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if(!campground){
    req.flash('error', 'Campground not found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm = async (req, res, next)=>{
  const campground = await Campground.findById(req.params.id)
  if(!campground){
    req.flash('error', 'Campground not found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit',{campground})
}

module.exports.saveEdit = async(req, res, next)=>{
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  //map-tiler
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  campground.geometry = geoData.features[0].geometry;

  const img = req.files.map(f => ({ url: f.path, filename: f.filename}))
  campground.images.push(...img)
  await campground.save()
  if (req.body.deleteImages) {
    for( let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
    
  }
  req.flash('success', 'Successfully upgraded campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async(req, res, next)=>{
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
}
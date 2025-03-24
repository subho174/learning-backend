const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log(error);
    
    // res.status(400).json({
    //   success: false,
    //  // message: err.message,
    // });
  }
};

module.exports= {asyncHandler}
export const getPoll = async (req, res, next) => {
    try {
        return res.status(200).json({success: true})
    } catch (error) {
        next(error)
    }
}

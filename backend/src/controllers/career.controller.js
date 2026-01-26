import Resume from '../models/Resume.js';

export const selectTargetRole = async (req, res) => {
    try {
        const { resumeId, targetRole } = req.body;

        if (!resumeId || !targetRole) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both resumeId and targetRole'
            });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { targetRole },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Target career role updated successfully',
            data: {
                resumeId: updatedResume._id,
                targetRole: updatedResume.targetRole
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error updating target role'
        });
    }
};

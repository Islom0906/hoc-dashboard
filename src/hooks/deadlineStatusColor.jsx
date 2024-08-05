import {deadlineColor} from "../constants/deadlineColor";

const DeadlineStatusColor = (statusDeadline) => {
        const deadlineStatus = statusDeadline;
        let color = deadlineColor.started.color;
        if (deadlineStatus === 'soon') {
            color = deadlineColor.soon.color;
        } else if (deadlineStatus === 'failed') {
            color =  deadlineColor.failed.color;
        } else if (deadlineStatus === 'progress') {
            color =  deadlineColor.progress.color;
        }else if (deadlineStatus === 'done') {
          color =  deadlineColor.done.color;
        }
        return color;
};

export default DeadlineStatusColor;
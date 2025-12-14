export const course = {
    course: {
        price: '${price}',
        free: 'Free',
        avgRating: 'Rating:\xa0',
        selfRating: 'Your rating: \xa0',
        instructor: 'Instructor: {instructor}',
        notRated: 'Not rated',
        studentTotal: 'Attenders: {studentTotal}',
        ratingList: {
            five: '5 stars',
            four: 'From 4 stars',
            three: 'From 3 stars',
            two: 'From 2 stars',
            one: 'From 1 stars',
            none: 'All',
        },
        createCourse: 'Create Course',
        active: 'Activate course',
        inactive: 'Suspend course',
        title: 'Course name',
        placeholder: 'Enter a course name',
        selectCategory: 'Course Category',
        description: 'Description',
        coursePrice: 'Course prices',
        startDate: 'Start date',
        endDate: 'End date',
        dateRange: 'Course date range',
        courseImage: 'Course image',
        actionList: {
            goToCourse: 'Join the course.',
            notOwnedCourse: 'This course belongs to another instructor.',
            rejectedCourse: 'You have been blocked from this course.',
            pendingCourse: 'Waiting the instructor to approve your request.',
            expiredCourse: 'The course has been expired.',
        },
        confirmDelete: 'Are you sure you want to delete this course?',
    },

    filters: {
        title: 'Course Sort:\xa0',
        keyword: 'Keyword',
        rating: 'Rating',
        category: 'Category',
        instructor: 'Instructor',
        apply: 'Filter',
    },

    table: {
        title: 'Title',
        description: 'Description',
        rating: 'Rating',
        instructor: 'Instructor:\xa0 {instructor}',
        studentCount: 'Attendee',
        price: 'Price',
    },

    preview: {
        content: 'Course Content',
    },

    errors: {
        emptyCourseList: 'Cannot find any course.',
        guestCourseList: 'You need to select your role first.',
        emptyTopicList: 'Cannot find any topic.',
        courseRejected: 'You have been blocked by the instructor.',
        declinedPayment: 'Payment declined. Please try again later.',
        getStudentListError: 'Get student list failed. Please try again later.',
        emptyStudentList: 'Cannot find any student.',
        getTopicListError: 'Cannot find any topic',
        getQuizListError: 'Error getting quiz list. Please try again later!',
        createNewQuizError: 'Error creating new quiz. Please try again later!',
        deleteQuizError: 'Error deleting new quiz. Please try again later!',
        topic: {
            getTopic: 'Get topic detail failed. Please try again later!',
            updateTopic: 'Update topic failed! Please try again later',
            createTopic: 'Create topic failed! Please try again later!',
            deleteTopic: 'Delete topic failed! Please try again later!',
        },
        emptyQuizList: 'This topic does not have any quiz yet.',
        sendMessageError: 'Cannot send message. Please try again later!',
        leaveRatingError: 'Leave rating error. Please try again later!',
        chooseRole: 'Cannot access course. Please select your role first!',
        deleteCourseError: 'Error deleting this course. Please try again later!',
        getCoursePreviewError:
            'Error getting course preview data. Please try again later!',
        getCourseList: 'Error getting course list. Please try again later!',
        courseCheckoutError: 'Error getting checkout data. Please try again later!',
        toggleFavoriteError: 'Error changing favorite course. Please try again later!',
        userCourseDataError: 'Error getting your course data. Please try again later!',
        getInstructorListError: 'Error getting instructor list. Please try again later!',
        getCategoryListError: 'Error getting category list. Please try again later!',
        toggleCourse: 'Change course state failed. Please try again later!',
        quiz: {
            updateTopic: 'Update quiz failed. Please try again later!',
            submitQuizError: 'Submit quiz failed. Please try again later!',
        },
        getLeaderboardError: 'Error getting leaderboard data. Please try again later!',
    },
    success: {
        favoriteCourse: {
            add: 'Successfully added this course to your favorite list.',
            remove: 'Successfully removed this course from your favorite list.',
        },
        courseCheckout: {
            freeCourse:
                'You have sent a request to join the course.Please kindly wait for the instructor to approve',
            paidCourse: 'Please complete the checkout',
            successPayment:
                'You have successfully bought this course. Please go back to the course page',
        },
        topic: {
            updateTopic: 'Update topic successfully!',
            createTopic: 'Create topic successfully!',
            deleteTopic: 'Delete topic successfully!',
        },
        quiz: {
            updateQuiz: 'Update quiz successfully!',
            createQuiz: 'Create quiz successfully!',
            deleteQuiz: 'Delete quiz successfully!',
            submitQuiz: 'Submit quiz successfully!',
        },
        leaveRating: 'Rate course successfully!',
        deleteCourse: 'Delete course successfully',
        toggleCourse: 'Change course status successfully!',
    },
    coursePopup: {
        showStudentList: 'Student List',
        showOutsideStudentList: 'Student List (not in course)',
    },

    studentListMode: {
        inside: 'Inside course',
        outside: 'Outside course',
        invite: 'Invite',
    },

    courseSidebar: {
        courseDetail: 'Course Details',
        quiz: 'Quizzes',
        studentList: 'Student List',
        deleteCourse: 'Delete Course',
        activateCourse: 'Activate Course',
        suspendCourse: 'Suspend Course',
    },

    topicSidebar: {
        title: 'Topic List',
        addTopic: 'Add new topic',
    },

    topic: {
        showVideo: 'Click here to show the video',
        hideVideo: 'Click here to hide the video',
        action: {
            createTitle: 'Create Topic',
            editTitle: 'Edit Topic',
            edit: 'Edit this Topic',
        },
        form: {
            title: 'Title',
            description: 'Description',
            content: 'Content',
            video: 'Upload video',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
        },
    },

    quiz: {
        form: {
            duration: '{time} minutes',
            mark: '{mark} points',
            isCorrect: 'Correct answer',
            addQuiz: 'Add a quiz',
            addQuestion: 'Add a question',
            addAnswer: 'Add an answer',
            title: 'Quiz Title',
            quizDuration: 'Duration',
            startDate: 'Start date',
            startTime: 'Start time',
            save: 'Save',
            cancel: 'Cancel',
            editQuiz: 'Edit Quiz',
        },
        field: {
            addQuestion: 'Question title',
            addAnswer: 'Answer title',
            addQuestionPlaceholder: 'Please enter a question name',
            question: 'Question',
            answer: 'Answer',
        },
        leaderboard: 'Leaderboard',
        submitQuiz: 'Submit Answers',
        doneQuiz: 'You have already completed this quiz.',
    },

    chat: {
        title: 'Chat ',
        sendMessage: 'Send message...',
        defaultSelect: 'Course',
        defaultMessage:
            'There is no one here. Be the first person to initiate the conversation!',
    },
    comment: {
        hidden: 'This comment is marked as sensitive. Click on the eye icon to reveal',
        instructor: ' (Instructor)',
        commentBlocked:
            'You have been blocked from commentting. Please contact the instructor.',
    },
};

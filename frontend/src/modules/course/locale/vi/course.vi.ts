export const course = {
    course: {
        price: '${price}',
        free: 'Miễn phí',
        instructor: 'Giảng viên: {instructor}',
        avgRating: 'Đánh giá:\xa0',
        selfRating: 'Đánh giá của bạn: \xa0',
        notRated: 'Chưa có đánh giá',
        studentTotal: 'Số học viên: {studentTotal}',
        ratingList: {
            five: '5 sao',
            four: '4 sao trở lên',
            three: '3 sao trở lên',
            two: '2 sao trở lên',
            one: '1 sao trở lên',
            none: 'Tất cả',
        },
        createCourse: 'Tạo khóa học',
        active: 'Kích hoạt khóa học',
        inactive: 'Tạm ngừng khóa học',
        title: 'Tên khóa học',
        placeholder: 'Nhập tên khóa học',
        selectCategory: 'Thể loại khóa học',
        description: 'Mô tả',
        coursePrice: 'Giá tiền khóa học',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        dateRange: 'Thời Gian khóa học',
        courseImage: 'Ảnh khóa học',
        actionList: {
            goToCourse: 'Vào khóa học',
            notOwnedCourse: 'Khóa học này của giảng viên khác',
            rejectedCourse: 'Bạn đã bị chặn khỏi khóa học này.',
            pendingCourse: 'Đã gửi yêu cầu tham gia khóa học',
            expiredCourse: 'Khóa học đã kết thúc.',
        },
        confirmDelete: 'Bạn có chắc chắn muốn xóa khóa học này không?',
    },

    filters: {
        title: 'Lọc khóa học\xa0',
        keyword: 'Từ khóa',
        rating: 'Đánh giá',
        category: 'Danh mục',
        instructor: 'Giảng viên',
        apply: 'Lọc',
    },

    table: {
        title: 'Tên khóa học',
        description: 'Mô tả',
        rating: 'Đánh giá',
        instructor: 'Giảng viên',
        studentCount: 'Số học viên',
        price: 'Giá',
    },

    preview: {
        content: 'Nội dung khóa học',
    },

    errors: {
        emptyCourseList: 'Không tìm thấy khóa học nào theo bộ lọc.',
        guestCourseList: 'Bạn cần chọn vai trò trước.',
        emptyTopicList: 'Không tìm thấy chủ đề nào.',
        courseRejected: 'Bạn đã bị giảng viên chặn khỏi khóa học.',
        declinedPayment: 'Thanh toán thất bại, xin vui lòng thử lại',
        notLoggedIn: 'Vui lòng đăng nhập trước',
        getStudentListError:
            'Xảy ra lỗi khi lấy danh sách học viên. Xin vui lòng thử lại sau',
        emptyStudentList: 'Không tìm thấy học viên nào',
        getTopicListError: 'Không tìm thấy chủ đề nào',
        instructorGetTopicError: 'Chưa có chủ đề, vui lòng tạo mới',
        getQuizListError: 'Có lỗi khi lấy danh sách quiz, vui lòng thử lại sau!',
        studentGetTopicError: 'Chưa có chủ đề',
        createNewQuizError: 'Có lỗi khi tạo mới quiz, xin vui lòng thử lại sau',
        deleteQuizError: 'Có lỗi khi xoá quiz, xin vui lòng thử lại sau!',
        emptyQuizList: 'Chưa có quiz, vui lòng tạo mới',
        topic: {
            updateTopic: 'Sửa topic thất bại, vui lòng thử lại sau',
            createTopic: 'Thêm topic thất bại, vui lòng thử lại sau!',
            deleteTopic: 'Xóa topic thất bại, vui lòng thử lại sau!',
        },
        getCoursePreviewError:
            'Có lỗi khi lấy dự liệu khóa học. Xin vui lòng thử lại sau!',
        sendMessageError: 'Gửi tin nhắn thất bại, vui lòng thử lại sau!',
        leaveRatingError: 'Đánh giá khóa học thất bại, vui lòng thử lại sau!',
        chooseRole: 'Không thể tham gia khóa học. Vui lòng chọn vai trò của bạn trước!',
        getCoursePreviewDataError:
            'Không thể lấy đánh giá khóa học, vui lòng thử lại sau!',
        deleteCourseError: 'Không thể xóa khóa học này, vui lòng thử lại sau!',
        toggleCourse: 'Thay đổi trạng thái khóa học thất bại, vui lòng thử lại sau!',
        quiz: {
            updateTopic: 'Thay đổi trạng thái bài tập thất bại, vui lòng thử lại sau!',
            submitQuiz: 'Nộp bài thất bại, xin vui lòng thử lại sau!',
        },
        getLeaderboardError:
            'Lấy dữ liệu bảng xếp hạng thất bại. Xin vui lòng thử lại sau!',
    },

    success: {
        favoriteCourse: {
            add: 'Bạn đã thêm khóa học này vào danh sách yêu thích',
            remove: 'Bạn đã xóa khóa học này khỏi danh sách yêu thích.',
        },
        courseCheckout: {
            freeCourse:
                'Đã gửi yêu cầu tham gia khóa học tới giảng viên. Xin hãy chờ phê duyệt',
            paidCourse: 'Vui lòng tiến hành thanh toán',
            successPayment: 'Bạn đã thanh toán thành công, vui lòng trở lại khóa học',
        },
        topic: {
            updateTopic: 'Sửa chủ đề thành công!',
            createTopic: 'Thêm chủ đề mới thành công!',
            deleteTopic: 'Xóa chủ đề thành công!',
        },
        quiz: {
            updateQuiz: 'Sửa bài tập thành công!',
            createQuiz: 'Tạo bài tập thành công!',
            deleteQuiz: 'Xóa bài tập thành công!',
            submitQuiz: 'Nộp bài tập thành công!',
        },
        leaveRating: 'Đánh giá khóa học thành công!!',
        deleteCourse: 'Xóa khóa học thành công!',
        toggleCourse: 'Thay đổi trạng thái khóa học thành công!',
    },

    courseDetail: {
        showStudentList: 'Danh sách học viên',
        showOutsideStudentList: 'Danh sách học viên ngoài khóa học',
    },

    studentListMode: {
        inside: 'Trong khóa học',
        outside: 'Ngoài khóa học',
        invite: 'Mời',
    },

    courseSidebar: {
        courseDetail: 'Nội dung khóa học',
        quiz: 'Bài tập',
        studentList: 'Danh sách học viên',
        deleteCourse: 'Xóa khóa học',
        activateCourse: 'Kích hoạt khóa học',
        suspendCourse: 'Tạm ngưng khóa học',
    },

    topicSidebar: {
        title: 'Danh mục',
        addTopic: 'Thêm chủ đề',
    },
    topic: {
        showVideo: 'Nhấn vào đây để xem video',
        hideVideo: 'Nhấn vào đây để ẩn video',
        action: {
            edit: 'Sửa chủ đề',
            createTitle: 'Thêm chủ đề mới',
            editTitle: 'Sửa chủ đề',
        },
        form: {
            title: 'Tên chủ đề',
            description: 'Mô tả',
            content: 'Nội dung',
            video: 'Đăng tải video',
            delete: 'Xóa',
            save: 'Lưu',
            cancel: 'Hủy',
        },
    },

    quiz: {
        form: {
            duration: '{time} phút',
            mark: '{mark} điểm',
            isCorrect: 'Đúng',
            addQuiz: 'Thêm bài tập',
            addQuestion: 'Thêm câu hỏi',
            addAnswer: 'Thêm câu trả lời',
            title: 'Tiêu đề',
            quizDuration: 'Thời lượng',
            startDate: 'Ngày',
            startTime: 'Thời gian',
            save: 'Lưu',
            cancel: 'Hủy',
            editQuiz: 'Sửa bài tập',
        },

        field: {
            addQuestion: 'Câu hỏi mới',
            addAnswer: 'Câu trả lời mới',
            addQuestionPlaceholder: 'Nhập tên câu hỏi',
            question: 'Câu',
            answer: 'Trả lời',
        },
        leaderboard: 'Đại lộ danh vọng',
        submitQuiz: 'Nộp bài',
        doneQuiz: 'Bạn đã làm quiz này rồi',
        quizScore: 'Điểm của bạn:\xa0{score}',
    },

    chat: {
        title: 'Trò chuyện',
        sendMessage: 'Gửi tin nhắn...',
        defaultSelect: 'Toàn khóa học',
        defaultMessage: 'Chưa có tin nhắn nào. Hãy là người đầu tiên bắt chuyện !',
    },

    comment: {
        hidden: 'Tin nhắn này bị hệ thống đánh giá là tiêu cực. Bấm vào biểu tượng con mắt nếu bạn muốn xem',
        instructor: ' (Giảng viên)',
        commentBlocked: 'Bạn đã bị chặn chat, vui lòng liên hệ giảng viên.',
    },
};

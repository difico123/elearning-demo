export const auth = {
    general: {
        welcomeTitle: 'Chào mừng bạn đến với Lớp học anh Huấn',
    },

    auth: {
        or: 'Hoặc',
        continue: 'Tiếp tục',
        passwordNotMatch: {
            setPassword: 'Mật khẩu chưa khớp với mật khẩu khởi tạo',
            forgotPassword: 'Mật khẩu chưa khớp với mật khẩu mới',
        },
        passwordNotStrongEnough: 'Vui lòng nhập 6 kí tự chứa cả chữ cái và số',
        ifYouHaveNotReceivedOtp: 'Nếu bạn chưa nhận được mã OTP',
        errorInputTextMaxLength: 'Vui lòng nhập không quá 50 kí tự',
        requiredField: 'Trường này là bắt buộc',
    },

    banner: {
        title1: 'Dạy & học trực tuyến chưa bao giờ dễ dàng đến thế',
        description1: 'Chào mừng bạn đến với lớp học múa quạt của anh Bảnh.',
        title2: 'Cần cù thì bù siêng năng',
        description2: 'Không làm mà muốn có ăn',
        title3: 'Thì chỉ có ăn đồng bằng ăn cát',
        description3: 'Lớp học do thầy Bùi Xuân Huấn giảng dạy',
    },

    forgotPassword: {
        welcomeDescription: 'Vui lòng nhập email để lấy đường link khôi phục mật khâỉ',
        forgotPassword: 'Quên mật khẩu?',
        email: {
            label: 'Email',
            placeholder: 'Nhập email',
        },
        resetPassword: 'Đặt lại mật khẩu',
        password: {
            label: 'Mật khẩu mới',
            placeholder: 'Nhập mật khẩu mới',
        },
        confirmPassword: {
            label: 'Xác nhận mật khẩu',
            placeholder: 'Xác nhận mật khẩu',
        },
        errors: {
            defaultErrors: 'Đặt lại mật khẩu không thành công',
            verifyCodeError: 'Mã code đặt lại mật khẩu không chính xác, vui lòng thử lại',
        },
        success: {
            setPassword: 'Đặt lại mật khẩu thành công',
            title: 'Gửi email đặt lại mật khẩu thành công',
            description: 'Hãy kiểm tra địa chỉ mail %{email} để đặt lại mật khẩu',
        },
    },

    login: {
        title: 'Đăng nhập',
        subTitle: 'Nhập mã OTP đã gửi qua số điện thoại',
        forgotPassword: 'Quên mật khẩu?',
        resendOtp: 'Gửi lại',
        zaloLogin: 'Đăng nhập bằng Zalo',
        facebookLogin: 'Đăng nhập bằng Facebook',
        googleLogin: 'Đăng nhập bằng Google',
        notHaveAccount: 'Bạn chưa có tài khoản?',
        register: 'Đăng ký',
        login: 'Đăng nhập',
        credential: {
            label: 'Email',
            placeholder: 'Nhập email',
            required: 'Yêu cầu nhập email hoặc số điện thoại',
            invalidFormat: 'Vui lòng nhập đúng định dạng email ',
        },
        email: {
            label: 'Email',
            placeholder: 'Nhập email',
        },
        password: {
            label: 'Mật khẩu',
            placeholder: 'Nhập mật khẩu',
            error: 'Mật khẩu cần chứa ít nhất 8 ký tự',
            emptyError: 'Mật khẩu không được để rỗng',
        },
        inputOtp: {
            title: 'Nhập mã xác nhận',
            description: 'Nhập mã OTP đã gửi qua số điện thoại',
        },
        defaultError: 'Địa chỉ email hoặc mật khẩu chưa đúng',
        loginError: 'Có lỗi khi đăng nhập. Xin vui lòng thử lại sau.',
        success: 'Đăng nhập thành công',
        sendOtpSuccess: 'Hãy kiểm tra mã OTP đã gửi qua số điện thoại %{phoneNumber}',
    },

    register: {
        welcomeDescription:
            'It is a long established fact that a reader will be distracted by the readable content of a.',
        register: 'Đăng ký',
        zaloRegister: 'Đăng ký bằng Zalo',
        facebookRegister: 'Đăng ký bằng Facebook',
        googleRegister: 'Đăng ký bằng Google',
        haveAccount: 'Bạn đã có tài khoản?',
        login: 'Đăng nhập',
        credential: {
            label: 'Email/Số điện thoại',
            placeholder: 'Nhập email hoặc số điện thoại',
            required: 'Yêu cầu nhập email hoặc số điện thoại',
            invalidFormat: 'Vui lòng nhập địa chỉ email hoặc số điện thoại hợp lệ',
        },
        success: {
            title: 'Đăng ký thành công',
            description:
                'Hãy kiểm tra thư xác nhận đăng ký tài khoản tại địa chỉ mail %{email}',
        },
        defaultError: {
            registerEmail: 'Đăng ký không thành công, vui lòng thử lại',
            activeEmail: 'Kích hoạt tài khoản không thành công, vui lòng thử lại',
        },
    },

    setPassword: {
        title: 'Đặt mật khẩu',
        subTitle: 'Hãy kiểm tra thư xác nhận đăng ký tài khoản',
        initPassword: 'Mật khẩu khởi tạo',
        invalidFormat: 'Vui lòng nhập 6 kí tự chứa cả chữ cái và số',
        confirmPassword: 'Xác nhận mật khẩu',
        placeholder: 'Nhập mật khẩu',
        success: 'Đặt mật khẩu thành công, vui lòng đăng nhập',
        errors: {
            mismatchError:
                'Mật khẩu khởi tạo và xác nhận chưa khớp, xin vui lòng thử lại.',
            defaultError: 'Đặt mật khẩu không thành công, xin vui lòng thử lại.',
            regexError:
                'Vui lòng đặt mật khẩu có chứa cả chữ số, chữ in hoa và kí tự đặc biệt.',
        },
    },

    role: {
        selectRole: 'Bạn là ... ?',
        student: 'Học sinh',
        instructor: 'Giảng viên',
        skip: 'Tôi muốn xem trang web trước',
        pendingRole: 'Đang chờ duyệt',
        pendingMessage:
            'Yêu cầu của bạn đã được gửi lên cho quản trị. Vui lòng chờ xét duyệt!',
        description: {
            instructor:
                'Thỏa sức sáng tạo với bộ bài giảng được chau chuốt tỉ mỉ bởi đội ngũ cố vấn của chúng tôi.',
            student:
                'Đắm chìm vào những bài học giá trị trong bất kỳ lĩnh vực nào, ở bất cứ đâu.',
        },
        successMessage: 'Bạn đã đăng ký trở thành {role}',
        pending: 'Vui lòng liên hệ admin để được chấp nhận',
    },
};

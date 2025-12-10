export const auth = {
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

    forgotPassword: {
        title: 'Chào mừng bạn đến với Sorademic',
        welcomeDescription:
            'It is a long established fact that a reader will be distracted by the readable content of a.',
        forgotPassword: 'Forgot password?',
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
            defaultError: 'Đặt lại mật khẩu không thành công',
            verifyCodeError: 'Invalid reset password code, please try again later',
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
            label: 'Email/Số điện thoại',
            placeholder: 'Nhập email hoặc số điện thoại',
            required: 'Yêu cầu nhập email hoặc số điện thoại',
            invalidFormat: 'Please enter the correct email format',
        },
        email: {
            label: 'Email',
            placeholder: 'Nhập email',
        },
        password: {
            label: 'Mật khẩu',
            placeholder: 'Nhập mật khẩu',
            error: 'Vui lòng đáp ứng các quy tắc mật khẩu',
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
        welcome: 'Chào mừng bạn đến với Sorademic',
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
        selectRole: 'You are... ?',
        student: 'Student',
        instructor: 'Instructor',
        skip: `No thanks, I'm just casually browsing`,
        pendingRole: 'Pending',
        pendingMessage:
            'Your request has been submitted to the administrator. Please kindly wait!',
        description: {
            instructor:
                'Put your creative ideas into practice with our decorative lectures, made only for you.',
            student:
                'Embrace yourself with knowledge and social academic activities, anywhere, anytime.',
        },
        successMessage: 'You have registered as a {role}',
        pending: 'pending',
    },
};

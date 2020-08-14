class Auth {
    constructor() {
        localStorage.setItem("isAuthenticated", this.getStatus() ?? false);
    }

    getStatus() {
        return JSON.parse(localStorage.getItem("isAuthenticated"));
    }

    async login(formData) {
        let res = await(await fetch("/api/user/login", { method: "POST", body: formData ?? {} })).json();
        this.setStatus(res.success);
        return res;
    }

    localLogout() {
        this.setStatus(false);
        window.location.reload();
    }

    async logout() {
        let res = await(await fetch("/api/user/logout", { method: "DELETE" })).json();
        if (res.success) { this.setStatus(false); }
        return res;
    }

    async register(formData) {
        let res = await(await fetch("/api/user/register", { method: "POST", body: formData })).json();
        this.setStatus(res.success);
        return res;
    }

    setStatus(status) {
        localStorage.setItem("isAuthenticated", status);
    }
}

export default new Auth();
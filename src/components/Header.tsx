import { HiOutlineDocumentDuplicate, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

export const Header = () => {
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <header className="relative border-b border-border">
            <div className="max-w-7xl mx-auto p-6 flex items-center gap-x-3">
                <Link to={user ? "/" : "/login"} className="flex items-center gap-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-accent-muted">
                        <HiOutlineDocumentDuplicate className="text-2xl text-accent" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                        Docs Weaver
                    </h1>
                </Link>
                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <>
                            <span className="hidden sm:inline text-sm text-text-secondary truncate max-w-[12rem]">
                                {user.name}
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm px-3 py-2 rounded-xl border border-border hover:border-border-accent hover:bg-accent-muted text-text-secondary hover:text-text-primary cursor-pointer"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm px-3 py-2 rounded-xl border border-border hover:border-border-accent hover:bg-accent-muted text-text-secondary hover:text-text-primary"
                        >
                            Sign in
                        </Link>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl border border-border hover:border-border-accent hover:bg-accent-muted cursor-pointer"
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        {theme === "dark" ? (
                            <HiOutlineSun className="text-xl text-accent" />
                        ) : (
                            <HiOutlineMoon className="text-xl text-accent" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}

import { Link, useNavigate } from '@tanstack/react-router';
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { profileSchema } from "../../type";
import { signOut } from "../../server/auth.api";
import { toast } from "sonner";

// props type lives in this file, so no export needed
type NavbarProps = {
  user: profileSchema | null;
};

const Navbar = ({ user }: NavbarProps) => {


  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const avatarButtonRef = useRef<HTMLButtonElement | null>(null);

  const avatarFallbackLetter = user?.full_name?.charAt(0).toUpperCase() ?? "?";


  const navigate = useNavigate()
  // ============ GSAP: animate the popup when it opens ============
  useGSAP(
    () => {
      if (isPopupOpen && popupRef.current) {
        gsap.fromTo(
          popupRef.current,
          { opacity: 0, y: -8, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" },
        );
      }
    },
    { dependencies: [isPopupOpen] },
  );

  useEffect(() => {
    if (!isPopupOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const clickTarget = event.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(clickTarget) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(clickTarget)
      ) {
        setIsPopupOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPopupOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isPopupOpen]);

  // ============ logout handler  =============
  const handleLogout = async () => {
    try {
      await signOut()

      toast.info('signed out successfully')
      navigate({
        to: '/'
      })
    } catch (e) {
      toast.error(`${e}`)
    }
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="mark">
          <div className="glyph" />
        </div>
        <Link to="/">
          <span>Skild</span>
        </Link>
      </div>

      <div className="actions">
        {/* show when the user is authed */}
        {user ? (
          <div className="relative">
            {/* avatar trigger */}
            <button
              ref={avatarButtonRef}
              type="button"
              onClick={() => setIsPopupOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={isPopupOpen}
              className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-sm font-semibold text-neutral-900 transition hover:ring-2 hover:ring-primary/40 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{avatarFallbackLetter}</span>
              )}
            </button>

            {/* popup: shows after the avatar click */}
            {isPopupOpen && (
              <div
                ref={popupRef}
                role="menu"
                className="absolute end-0 mt-2 flex w-60 max-md:w-[calc(100vw-2rem)] flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
              >
                {/* big avatar */}
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-lg font-semibold text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{avatarFallbackLetter}</span>
                  )}
                </div>

                {/* email */}
                <p className="max-w-full truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {user.email}
                </p>

                {/* full name */}
                <p className="max-w-full truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {user.full_name}
                </p>

                {/* divider */}
                <hr className="my-1 w-full border-neutral-200 dark:border-neutral-800" />

                {/* logout button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* show if the user isn't authed */
          <Link to="/sign-in/$" className="btn-primary">
            <LogIn size={16} />
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

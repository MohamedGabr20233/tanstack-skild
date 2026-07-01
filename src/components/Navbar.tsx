import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

const Navbar = () => {
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

        <Show when="signed-in">
          <UserButton />
        </Show>

        {/* we will use <Show/> that shows content based on authentication status if he signed in or authed */}
        <Show when="signed-out">
          {/* we will create a custom sign in and sign up pages */}
          {/* <SignInButton  mode="redirect"/> */}

          <Link to="/sign-in/$" className="btn-primary">
            <LogIn size={16} />
            Sign in
          </Link>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;

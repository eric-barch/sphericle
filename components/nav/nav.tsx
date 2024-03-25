import { StickyNav } from "./sticky-nav";
import { SignInButton } from "./sign-in-button";
import { FloatingNav } from "./floating-nav";

type NavProps = {
  floating?: boolean;
};

const Nav = (props: NavProps) => {
  const { floating = false } = props;

  return (
    <>
      {floating ? (
        <FloatingNav>
          <SignInButton />
        </FloatingNav>
      ) : (
        <StickyNav>
          <SignInButton />
        </StickyNav>
      )}
    </>
  );
};

export { Nav };

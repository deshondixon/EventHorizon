export default function Footer() {
  return (
    <>
      <footer className='navbar fixed-bottom'>
        <div className='container-fluid'>
          <a href='https://www.webucator.com' className='nav-link text-light'>
            Copyright &copy; {new Date().getFullYear()}
          </a>
        </div>
      </footer>
    </>
  );
}

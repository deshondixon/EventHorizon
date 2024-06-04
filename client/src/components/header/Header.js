import SearchBar from './SearchBar';

export default function Header() {
  return (
    <>
      <header>
        <nav className='navbar navbar-dark '>
          <div className='container-fluid'>
            <a className='navbar-brand' href='/'>
              Event Horizon
            </a>
            <SearchBar />
          </div>
        </nav>
      </header>
    </>
  );
}
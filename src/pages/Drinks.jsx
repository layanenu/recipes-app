import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MyContext from '../context/MyContext';

function Drinks() {
  const { dataDrink } = useContext(MyContext);

  return (
    <div>
      <Header />
      {dataDrink?.map((e, index) => (
        <div data-testid={ `${index}-recipe-card` } key={ e.idDrink }>
          <div data-testid={ `${index}-card-name` }>{e.strDrink}</div>
          <img
            data-testid={ `${index}-card-img` }
            src={ e.strDrinkThumb }
            alt={ e.strDrink }
          />
        </div>
      ))}
      <Footer />
    </div>
  );
}

export default Drinks;

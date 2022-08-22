import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  console.log('editingFood', editingFood);

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods');
    setFoods(response.data);
    }
    getFoods();
  }, []);

  const handleAddFood = async food => {
    const { newFoods } = foods;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...newFoods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async food => {
    const { newFoods } = foods;
  
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = newFoods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      this.setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async id => {
    const { newFoods } = foods;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = newFoods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = food => {
    console.log(food);
    setEditingFood(food);
    setEditModalOpen(true);
  }

  
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Header, Image, Button, Modal, Form, Icon } from 'semantic-ui-react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [image_url, setImageUrl] = useState('');
  const url = 'https://phase-3-sinatra-react-project-production-dd92.up.railway.app/'
  const url2 = 'https://phase-3-sinatra-react-project-production-dd92.up.railway.app'

  useEffect(() => {
    fetch(`${url}users`)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleDeleteUser = (userId) => {
    axios.delete(`${url}/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error(error));
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image_url);

    axios
      .post(`${url}users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setUsers([...users, response.data]);
        setName('');
        setImageUrl(null);
        handleModalClose();
      })
      .catch((error) => console.error(error));
  };


  return (
    <>
      <Header as="h2">User Profiles</Header>
      <Button icon style={{ margin: "15px" }} onClick={handleModalOpen}> <Icon name='plus' /> Add User </Button>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>
                <Image src={`${url2}${user.image_url}`} size="tiny" rounded />
              </Table.Cell>
              <Table.Cell>
                <Link to={`/users/details/${user.id}`}>
                  <Button>View</Button>
                </Link>
                <Button
                  color="red"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Modal.Header>Add User</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label htmlFor="name-input">Name</label>
              <input
                id="name-input"
                placeholder="User name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="image-input">Select a profile image:</label>
              <input
                id="image-input"
                type="file"
                onChange={(event) => setImageUrl(event.target.files[0])}
              />
            </Form.Field>
            <Button type="submit" disabled={!name || !image_url}>
              Add
            </Button>
          </Form>
        </Modal.Content>
      </Modal>

    </>
  );
}

export default UserList;


from cryptography.fernet import Fernet

# Generate a Fernet key
key = Fernet.generate_key()

# Print the key
print(key.decode())

# Use this key in models.py

# to decrpyt the view input the key in the url query like this /api/userdata/?key=your_key_here

#current fernet key:
# owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO7k=

# change the key in .env in react section too since it retrieves data
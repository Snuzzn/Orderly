import pickle

data = {
}

with open('store.p', 'wb') as FILE:
  FILE.write(pickle.dumps(data))


# with open('store.p', 'rb') as FILE:
#   data = pickle.load(FILE)
#   print(data)


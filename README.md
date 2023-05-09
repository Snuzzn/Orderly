# Setup on VLAB

The following instructions can be used to setup and run the project on VLAB. If you experience any issues with VLAB, we have also provided a [manual](https://hackmd.io/Z7inu3SoRs2KIAR0H1Njzw) to setup the project on Virtual Box on your local machine. 

## Getting started
1. `git clone` the repository or `unzip` the submission file
2. Enter the project directory using `cd capstone-project-3900-w11b-meerkats`


## Setting up the backend
1. Change to backend directory using `cd backend`
2. Run `python3 -m pip install --upgrade pip` to upgrade to the latest version of `pip` 
3. Set up and start the **virtual environment**
    - Run `pip3 install virtualenv` to install virtual environment module
    - Run `python3 -m virtualenv venv/` to set up the virtual environment
    - Run`source venv/bin/activate` to start the virtual envrionemt
4. Run `pip3 install -r requirements.txt` to **install required modules**
5. Run `bash runFlask.sh backend` to **start the flask server**


## Setting up the frontend
1. Create a new terminal window (the backend server should still be running in the other window)
2. Enter the project directory again, and change to the frontend directory using `cd frontend`
3. Run `node -v` to check that Node version is **at least 16**. If not, use the following steps to upgrade:
    - Run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash` to install nvm (node version manager)
    - Run `source ~/.nvm/nvm.sh` to recognise the `nvm` command. If that doesn't work, restart the terminal manually, go back into the frontend folder, then continue to the next step
    - Run `nvm install --lts` to upgrade to the latest version of Node
4. Run `npm install` to **install all dependencies** for the React project
5. Run `npm start` to **start the development server**
6. If a browser doesn't open automatically, open it manually and visit the following URL: http://localhost:3813/
7. **Allow cookies** in the browser for authentication
    - Open the browser settings (three dots at top right)
    - Go to "Privacy and Security" page
    - Make sure that cookies are allowed. To do this on Firefox, go to 'Custom', then uncheck 'Cookies'
8. View the app in a **mobile screen size** (since target users will likely be on mobile) 
    - At the localhost page from before, right click anywhere on the page and click 'Inspect element' in the dropdown
    - Click on the phone icon located at the top of the dev tools
    - Open the devices dropdown at the top middle (it starts with 'Responsive' by default), and click on 'iPhone 11 Pro Max'
    - You can alternatively drag the edges to resize it manually

# Exploring an existing restaurant
- If you'd like to see an existing restaurant that has been preloaded with sample data, please login with the following manager account details:
    - Username: meerkats-admin@gmail.com
    - Password: M33rkatsExample!
- Also, you can use the following link to see the customer page for Table 1 in that example restaurant:
    - http://localhost:3813/restaurant/2643c402-195a-44e8-a945-d80a8d3895e8/table/1/menu
    - This is simply for your convenience; a customer would usually scan the QR code to get to that link (the manager can generate these QR codes in the Admin page).



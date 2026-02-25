import { MatchFormat, TournamentType } from '../backend';

export interface TeamData {
  name: string;
  code: string;
  color: string;
  flag: string;
  players: PlayerData[];
}

export interface PlayerData {
  name: string;
  battingRating: number;
  bowlingRating: number;
}

// International Teams
export const INTERNATIONAL_TEAMS: TeamData[] = [
  {
    name: 'India', code: 'IND', color: '#1a6bb5', flag: '🇮🇳',
    players: [
      { name: 'Rohit Sharma', battingRating: 92, bowlingRating: 20 },
      { name: 'Virat Kohli', battingRating: 95, bowlingRating: 15 },
      { name: 'Shubman Gill', battingRating: 85, bowlingRating: 10 },
      { name: 'KL Rahul', battingRating: 88, bowlingRating: 10 },
      { name: 'Hardik Pandya', battingRating: 78, bowlingRating: 75 },
      { name: 'Ravindra Jadeja', battingRating: 72, bowlingRating: 82 },
      { name: 'Jasprit Bumrah', battingRating: 25, bowlingRating: 96 },
      { name: 'Mohammed Shami', battingRating: 20, bowlingRating: 90 },
      { name: 'Kuldeep Yadav', battingRating: 22, bowlingRating: 85 },
      { name: 'Axar Patel', battingRating: 65, bowlingRating: 80 },
      { name: 'Yashasvi Jaiswal', battingRating: 87, bowlingRating: 10 },
    ]
  },
  {
    name: 'Australia', code: 'AUS', color: '#f5a623', flag: '🇦🇺',
    players: [
      { name: 'David Warner', battingRating: 88, bowlingRating: 15 },
      { name: 'Steve Smith', battingRating: 94, bowlingRating: 30 },
      { name: 'Pat Cummins', battingRating: 45, bowlingRating: 93 },
      { name: 'Mitchell Starc', battingRating: 35, bowlingRating: 91 },
      { name: 'Josh Hazlewood', battingRating: 20, bowlingRating: 89 },
      { name: 'Travis Head', battingRating: 85, bowlingRating: 40 },
      { name: 'Marnus Labuschagne', battingRating: 90, bowlingRating: 45 },
      { name: 'Alex Carey', battingRating: 72, bowlingRating: 10 },
      { name: 'Cameron Green', battingRating: 75, bowlingRating: 72 },
      { name: 'Nathan Lyon', battingRating: 30, bowlingRating: 85 },
      { name: 'Glenn Maxwell', battingRating: 82, bowlingRating: 65 },
    ]
  },
  {
    name: 'England', code: 'ENG', color: '#003087', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    players: [
      { name: 'Joe Root', battingRating: 93, bowlingRating: 40 },
      { name: 'Ben Stokes', battingRating: 85, bowlingRating: 82 },
      { name: 'Jonny Bairstow', battingRating: 83, bowlingRating: 10 },
      { name: 'Jos Buttler', battingRating: 87, bowlingRating: 10 },
      { name: 'Stuart Broad', battingRating: 35, bowlingRating: 88 },
      { name: 'James Anderson', battingRating: 15, bowlingRating: 90 },
      { name: 'Jofra Archer', battingRating: 30, bowlingRating: 87 },
      { name: 'Moeen Ali', battingRating: 70, bowlingRating: 75 },
      { name: 'Harry Brook', battingRating: 88, bowlingRating: 20 },
      { name: 'Zak Crawley', battingRating: 80, bowlingRating: 10 },
      { name: 'Mark Wood', battingRating: 28, bowlingRating: 85 },
    ]
  },
  {
    name: 'Pakistan', code: 'PAK', color: '#01411c', flag: '🇵🇰',
    players: [
      { name: 'Babar Azam', battingRating: 93, bowlingRating: 10 },
      { name: 'Shaheen Afridi', battingRating: 25, bowlingRating: 92 },
      { name: 'Mohammad Rizwan', battingRating: 86, bowlingRating: 10 },
      { name: 'Naseem Shah', battingRating: 20, bowlingRating: 88 },
      { name: 'Shadab Khan', battingRating: 65, bowlingRating: 80 },
      { name: 'Fakhar Zaman', battingRating: 82, bowlingRating: 10 },
      { name: 'Imam-ul-Haq', battingRating: 80, bowlingRating: 10 },
      { name: 'Haris Rauf', battingRating: 25, bowlingRating: 85 },
      { name: 'Iftikhar Ahmed', battingRating: 72, bowlingRating: 55 },
      { name: 'Agha Salman', battingRating: 68, bowlingRating: 60 },
      { name: 'Usama Mir', battingRating: 30, bowlingRating: 78 },
    ]
  },
  {
    name: 'South Africa', code: 'SA', color: '#007a4d', flag: '🇿🇦',
    players: [
      { name: 'Quinton de Kock', battingRating: 87, bowlingRating: 10 },
      { name: 'Kagiso Rabada', battingRating: 30, bowlingRating: 92 },
      { name: 'Aiden Markram', battingRating: 83, bowlingRating: 45 },
      { name: 'Temba Bavuma', battingRating: 80, bowlingRating: 10 },
      { name: 'Anrich Nortje', battingRating: 20, bowlingRating: 88 },
      { name: 'David Miller', battingRating: 82, bowlingRating: 10 },
      { name: 'Marco Jansen', battingRating: 55, bowlingRating: 82 },
      { name: 'Keshav Maharaj', battingRating: 35, bowlingRating: 83 },
      { name: 'Rassie van der Dussen', battingRating: 82, bowlingRating: 20 },
      { name: 'Heinrich Klaasen', battingRating: 84, bowlingRating: 10 },
      { name: 'Tabraiz Shamsi', battingRating: 20, bowlingRating: 82 },
    ]
  },
  {
    name: 'New Zealand', code: 'NZ', color: '#000000', flag: '🇳🇿',
    players: [
      { name: 'Kane Williamson', battingRating: 92, bowlingRating: 30 },
      { name: 'Trent Boult', battingRating: 25, bowlingRating: 90 },
      { name: 'Tim Southee', battingRating: 40, bowlingRating: 87 },
      { name: 'Devon Conway', battingRating: 85, bowlingRating: 10 },
      { name: 'Daryl Mitchell', battingRating: 82, bowlingRating: 40 },
      { name: 'Tom Latham', battingRating: 80, bowlingRating: 10 },
      { name: 'Glenn Phillips', battingRating: 78, bowlingRating: 55 },
      { name: 'Mitchell Santner', battingRating: 60, bowlingRating: 78 },
      { name: 'Matt Henry', battingRating: 30, bowlingRating: 82 },
      { name: 'Rachin Ravindra', battingRating: 83, bowlingRating: 55 },
      { name: 'Kyle Jamieson', battingRating: 50, bowlingRating: 83 },
    ]
  },
  {
    name: 'West Indies', code: 'WI', color: '#7b0000', flag: '🏝️',
    players: [
      { name: 'Nicholas Pooran', battingRating: 83, bowlingRating: 10 },
      { name: 'Shai Hope', battingRating: 82, bowlingRating: 10 },
      { name: 'Jason Holder', battingRating: 65, bowlingRating: 82 },
      { name: 'Alzarri Joseph', battingRating: 25, bowlingRating: 85 },
      { name: 'Shimron Hetmyer', battingRating: 80, bowlingRating: 10 },
      { name: 'Rovman Powell', battingRating: 78, bowlingRating: 30 },
      { name: 'Kyle Mayers', battingRating: 78, bowlingRating: 55 },
      { name: 'Akeal Hosein', battingRating: 40, bowlingRating: 78 },
      { name: 'Gudakesh Motie', battingRating: 25, bowlingRating: 78 },
      { name: 'Brandon King', battingRating: 78, bowlingRating: 10 },
      { name: 'Yannic Cariah', battingRating: 55, bowlingRating: 72 },
    ]
  },
  {
    name: 'Sri Lanka', code: 'SL', color: '#003580', flag: '🇱🇰',
    players: [
      { name: 'Kusal Mendis', battingRating: 82, bowlingRating: 10 },
      { name: 'Wanindu Hasaranga', battingRating: 65, bowlingRating: 85 },
      { name: 'Dushmantha Chameera', battingRating: 30, bowlingRating: 82 },
      { name: 'Pathum Nissanka', battingRating: 80, bowlingRating: 10 },
      { name: 'Charith Asalanka', battingRating: 78, bowlingRating: 30 },
      { name: 'Dasun Shanaka', battingRating: 72, bowlingRating: 65 },
      { name: 'Maheesh Theekshana', battingRating: 25, bowlingRating: 82 },
      { name: 'Dilshan Madushanka', battingRating: 20, bowlingRating: 80 },
      { name: 'Kusal Perera', battingRating: 78, bowlingRating: 10 },
      { name: 'Angelo Mathews', battingRating: 80, bowlingRating: 55 },
      { name: 'Lahiru Kumara', battingRating: 20, bowlingRating: 78 },
    ]
  },
  {
    name: 'Bangladesh', code: 'BAN', color: '#006a4e', flag: '🇧🇩',
    players: [
      { name: 'Shakib Al Hasan', battingRating: 80, bowlingRating: 82 },
      { name: 'Mushfiqur Rahim', battingRating: 80, bowlingRating: 10 },
      { name: 'Litton Das', battingRating: 78, bowlingRating: 10 },
      { name: 'Taskin Ahmed', battingRating: 25, bowlingRating: 82 },
      { name: 'Mustafizur Rahman', battingRating: 20, bowlingRating: 83 },
      { name: 'Mehidy Hasan', battingRating: 60, bowlingRating: 78 },
      { name: 'Najmul Hossain Shanto', battingRating: 78, bowlingRating: 10 },
      { name: 'Towhid Hridoy', battingRating: 75, bowlingRating: 30 },
      { name: 'Tanzid Hasan', battingRating: 72, bowlingRating: 10 },
      { name: 'Shoriful Islam', battingRating: 25, bowlingRating: 78 },
      { name: 'Rishad Hossain', battingRating: 30, bowlingRating: 75 },
    ]
  },
  {
    name: 'Afghanistan', code: 'AFG', color: '#000000', flag: '🇦🇫',
    players: [
      { name: 'Rashid Khan', battingRating: 55, bowlingRating: 93 },
      { name: 'Mohammad Nabi', battingRating: 68, bowlingRating: 78 },
      { name: 'Mujeeb Ur Rahman', battingRating: 20, bowlingRating: 85 },
      { name: 'Ibrahim Zadran', battingRating: 78, bowlingRating: 10 },
      { name: 'Rahmanullah Gurbaz', battingRating: 80, bowlingRating: 10 },
      { name: 'Azmatullah Omarzai', battingRating: 72, bowlingRating: 70 },
      { name: 'Gulbadin Naib', battingRating: 65, bowlingRating: 68 },
      { name: 'Naveen-ul-Haq', battingRating: 30, bowlingRating: 80 },
      { name: 'Fazalhaq Farooqi', battingRating: 20, bowlingRating: 82 },
      { name: 'Noor Ahmad', battingRating: 20, bowlingRating: 80 },
      { name: 'Hashmatullah Shahidi', battingRating: 75, bowlingRating: 10 },
    ]
  },
  {
    name: 'Zimbabwe', code: 'ZIM', color: '#006400', flag: '🇿🇼',
    players: [
      { name: 'Sikandar Raza', battingRating: 78, bowlingRating: 72 },
      { name: 'Sean Williams', battingRating: 75, bowlingRating: 68 },
      { name: 'Craig Ervine', battingRating: 72, bowlingRating: 10 },
      { name: 'Blessing Muzarabani', battingRating: 20, bowlingRating: 80 },
      { name: 'Tendai Chatara', battingRating: 20, bowlingRating: 75 },
      { name: 'Ryan Burl', battingRating: 68, bowlingRating: 65 },
      { name: 'Regis Chakabva', battingRating: 70, bowlingRating: 10 },
      { name: 'Innocent Kaia', battingRating: 68, bowlingRating: 10 },
      { name: 'Clive Madande', battingRating: 60, bowlingRating: 10 },
      { name: 'Wellington Masakadza', battingRating: 55, bowlingRating: 65 },
      { name: 'Victor Nyauchi', battingRating: 20, bowlingRating: 72 },
    ]
  },
  {
    name: 'Ireland', code: 'IRE', color: '#169b62', flag: '🇮🇪',
    players: [
      { name: 'Paul Stirling', battingRating: 78, bowlingRating: 55 },
      { name: 'Andrew Balbirnie', battingRating: 75, bowlingRating: 10 },
      { name: 'Josh Little', battingRating: 20, bowlingRating: 78 },
      { name: 'Mark Adair', battingRating: 65, bowlingRating: 72 },
      { name: 'Lorcan Tucker', battingRating: 70, bowlingRating: 10 },
      { name: 'Harry Tector', battingRating: 72, bowlingRating: 20 },
      { name: 'George Dockrell', battingRating: 55, bowlingRating: 68 },
      { name: 'Barry McCarthy', battingRating: 30, bowlingRating: 70 },
      { name: 'Craig Young', battingRating: 25, bowlingRating: 68 },
      { name: 'Gareth Delany', battingRating: 65, bowlingRating: 60 },
      { name: 'Curtis Campher', battingRating: 65, bowlingRating: 65 },
    ]
  },
];

// IPL Teams
export const IPL_TEAMS: TeamData[] = [
  {
    name: 'Mumbai Indians', code: 'MI', color: '#004ba0', flag: '🔵',
    players: [
      { name: 'Rohit Sharma', battingRating: 92, bowlingRating: 20 },
      { name: 'Ishan Kishan', battingRating: 82, bowlingRating: 10 },
      { name: 'Suryakumar Yadav', battingRating: 90, bowlingRating: 10 },
      { name: 'Hardik Pandya', battingRating: 78, bowlingRating: 75 },
      { name: 'Kieron Pollard', battingRating: 80, bowlingRating: 65 },
      { name: 'Jasprit Bumrah', battingRating: 25, bowlingRating: 96 },
      { name: 'Trent Boult', battingRating: 25, bowlingRating: 88 },
      { name: 'Tim David', battingRating: 82, bowlingRating: 10 },
      { name: 'Tilak Varma', battingRating: 80, bowlingRating: 10 },
      { name: 'Piyush Chawla', battingRating: 35, bowlingRating: 75 },
      { name: 'Dewald Brevis', battingRating: 78, bowlingRating: 10 },
    ]
  },
  {
    name: 'Chennai Super Kings', code: 'CSK', color: '#f7a721', flag: '🟡',
    players: [
      { name: 'MS Dhoni', battingRating: 82, bowlingRating: 10 },
      { name: 'Ruturaj Gaikwad', battingRating: 85, bowlingRating: 10 },
      { name: 'Devon Conway', battingRating: 83, bowlingRating: 10 },
      { name: 'Moeen Ali', battingRating: 70, bowlingRating: 75 },
      { name: 'Ravindra Jadeja', battingRating: 72, bowlingRating: 82 },
      { name: 'Deepak Chahar', battingRating: 40, bowlingRating: 82 },
      { name: 'Tushar Deshpande', battingRating: 20, bowlingRating: 78 },
      { name: 'Shivam Dube', battingRating: 78, bowlingRating: 55 },
      { name: 'Ajinkya Rahane', battingRating: 78, bowlingRating: 10 },
      { name: 'Matheesha Pathirana', battingRating: 20, bowlingRating: 82 },
      { name: 'Rachin Ravindra', battingRating: 80, bowlingRating: 55 },
    ]
  },
  {
    name: 'Royal Challengers Bengaluru', code: 'RCB', color: '#ec1c24', flag: '🔴',
    players: [
      { name: 'Virat Kohli', battingRating: 95, bowlingRating: 15 },
      { name: 'Faf du Plessis', battingRating: 85, bowlingRating: 10 },
      { name: 'Glenn Maxwell', battingRating: 82, bowlingRating: 65 },
      { name: 'Mohammed Siraj', battingRating: 20, bowlingRating: 85 },
      { name: 'Dinesh Karthik', battingRating: 78, bowlingRating: 10 },
      { name: 'Harshal Patel', battingRating: 35, bowlingRating: 82 },
      { name: 'Wanindu Hasaranga', battingRating: 65, bowlingRating: 85 },
      { name: 'Rajat Patidar', battingRating: 80, bowlingRating: 10 },
      { name: 'Anuj Rawat', battingRating: 72, bowlingRating: 10 },
      { name: 'Alzarri Joseph', battingRating: 25, bowlingRating: 83 },
      { name: 'Yash Dayal', battingRating: 20, bowlingRating: 78 },
    ]
  },
  {
    name: 'Kolkata Knight Riders', code: 'KKR', color: '#3a225d', flag: '🟣',
    players: [
      { name: 'Shreyas Iyer', battingRating: 85, bowlingRating: 10 },
      { name: 'Andre Russell', battingRating: 85, bowlingRating: 80 },
      { name: 'Sunil Narine', battingRating: 72, bowlingRating: 85 },
      { name: 'Venkatesh Iyer', battingRating: 78, bowlingRating: 55 },
      { name: 'Nitish Rana', battingRating: 78, bowlingRating: 40 },
      { name: 'Varun Chakravarthy', battingRating: 20, bowlingRating: 82 },
      { name: 'Pat Cummins', battingRating: 45, bowlingRating: 90 },
      { name: 'Rinku Singh', battingRating: 80, bowlingRating: 10 },
      { name: 'Phil Salt', battingRating: 82, bowlingRating: 10 },
      { name: 'Harshit Rana', battingRating: 25, bowlingRating: 78 },
      { name: 'Mitchell Starc', battingRating: 35, bowlingRating: 88 },
    ]
  },
  {
    name: 'Delhi Capitals', code: 'DC', color: '#0078bc', flag: '🔵',
    players: [
      { name: 'David Warner', battingRating: 88, bowlingRating: 15 },
      { name: 'Prithvi Shaw', battingRating: 80, bowlingRating: 10 },
      { name: 'Rishabh Pant', battingRating: 85, bowlingRating: 10 },
      { name: 'Axar Patel', battingRating: 65, bowlingRating: 80 },
      { name: 'Anrich Nortje', battingRating: 20, bowlingRating: 88 },
      { name: 'Kuldeep Yadav', battingRating: 22, bowlingRating: 85 },
      { name: 'Mitchell Marsh', battingRating: 80, bowlingRating: 70 },
      { name: 'Tristan Stubbs', battingRating: 78, bowlingRating: 10 },
      { name: 'Ishant Sharma', battingRating: 20, bowlingRating: 80 },
      { name: 'Mukesh Kumar', battingRating: 20, bowlingRating: 78 },
      { name: 'Jake Fraser-McGurk', battingRating: 82, bowlingRating: 10 },
    ]
  },
  {
    name: 'Punjab Kings', code: 'PBKS', color: '#ed1b24', flag: '🔴',
    players: [
      { name: 'Shikhar Dhawan', battingRating: 83, bowlingRating: 10 },
      { name: 'Jonny Bairstow', battingRating: 83, bowlingRating: 10 },
      { name: 'Liam Livingstone', battingRating: 82, bowlingRating: 65 },
      { name: 'Sam Curran', battingRating: 68, bowlingRating: 78 },
      { name: 'Arshdeep Singh', battingRating: 25, bowlingRating: 85 },
      { name: 'Kagiso Rabada', battingRating: 30, bowlingRating: 90 },
      { name: 'Rahul Chahar', battingRating: 25, bowlingRating: 78 },
      { name: 'Prabhsimran Singh', battingRating: 78, bowlingRating: 10 },
      { name: 'Rilee Rossouw', battingRating: 80, bowlingRating: 10 },
      { name: 'Harpreet Brar', battingRating: 55, bowlingRating: 72 },
      { name: 'Nathan Ellis', battingRating: 20, bowlingRating: 78 },
    ]
  },
  {
    name: 'Rajasthan Royals', code: 'RR', color: '#e91e8c', flag: '🩷',
    players: [
      { name: 'Sanju Samson', battingRating: 85, bowlingRating: 10 },
      { name: 'Jos Buttler', battingRating: 87, bowlingRating: 10 },
      { name: 'Yashasvi Jaiswal', battingRating: 87, bowlingRating: 10 },
      { name: 'Shimron Hetmyer', battingRating: 80, bowlingRating: 10 },
      { name: 'Ravichandran Ashwin', battingRating: 55, bowlingRating: 85 },
      { name: 'Trent Boult', battingRating: 25, bowlingRating: 88 },
      { name: 'Yuzvendra Chahal', battingRating: 15, bowlingRating: 85 },
      { name: 'Riyan Parag', battingRating: 78, bowlingRating: 45 },
      { name: 'Dhruv Jurel', battingRating: 75, bowlingRating: 10 },
      { name: 'Sandeep Sharma', battingRating: 20, bowlingRating: 78 },
      { name: 'Avesh Khan', battingRating: 20, bowlingRating: 80 },
    ]
  },
  {
    name: 'Sunrisers Hyderabad', code: 'SRH', color: '#f7a721', flag: '🟠',
    players: [
      { name: 'David Warner', battingRating: 88, bowlingRating: 15 },
      { name: 'Kane Williamson', battingRating: 90, bowlingRating: 30 },
      { name: 'Bhuvneshwar Kumar', battingRating: 40, bowlingRating: 85 },
      { name: 'T Natarajan', battingRating: 20, bowlingRating: 80 },
      { name: 'Rashid Khan', battingRating: 55, bowlingRating: 93 },
      { name: 'Aiden Markram', battingRating: 83, bowlingRating: 45 },
      { name: 'Heinrich Klaasen', battingRating: 84, bowlingRating: 10 },
      { name: 'Travis Head', battingRating: 85, bowlingRating: 40 },
      { name: 'Pat Cummins', battingRating: 45, bowlingRating: 90 },
      { name: 'Abhishek Sharma', battingRating: 80, bowlingRating: 55 },
      { name: 'Jaydev Unadkat', battingRating: 20, bowlingRating: 78 },
    ]
  },
  {
    name: 'Lucknow Super Giants', code: 'LSG', color: '#a72b2a', flag: '🔴',
    players: [
      { name: 'KL Rahul', battingRating: 88, bowlingRating: 10 },
      { name: 'Quinton de Kock', battingRating: 87, bowlingRating: 10 },
      { name: 'Marcus Stoinis', battingRating: 78, bowlingRating: 72 },
      { name: 'Nicholas Pooran', battingRating: 83, bowlingRating: 10 },
      { name: 'Ravi Bishnoi', battingRating: 25, bowlingRating: 82 },
      { name: 'Mark Wood', battingRating: 28, bowlingRating: 85 },
      { name: 'Krunal Pandya', battingRating: 68, bowlingRating: 75 },
      { name: 'Deepak Hooda', battingRating: 75, bowlingRating: 55 },
      { name: 'Mohsin Khan', battingRating: 20, bowlingRating: 78 },
      { name: 'Ayush Badoni', battingRating: 72, bowlingRating: 30 },
      { name: 'Amit Mishra', battingRating: 25, bowlingRating: 78 },
    ]
  },
  {
    name: 'Gujarat Titans', code: 'GT', color: '#1c1c1c', flag: '⚫',
    players: [
      { name: 'Hardik Pandya', battingRating: 78, bowlingRating: 75 },
      { name: 'Shubman Gill', battingRating: 85, bowlingRating: 10 },
      { name: 'David Miller', battingRating: 82, bowlingRating: 10 },
      { name: 'Mohammed Shami', battingRating: 20, bowlingRating: 90 },
      { name: 'Rashid Khan', battingRating: 55, bowlingRating: 93 },
      { name: 'Wriddhiman Saha', battingRating: 72, bowlingRating: 10 },
      { name: 'Vijay Shankar', battingRating: 68, bowlingRating: 65 },
      { name: 'Rahul Tewatia', battingRating: 72, bowlingRating: 60 },
      { name: 'Alzarri Joseph', battingRating: 25, bowlingRating: 83 },
      { name: 'Noor Ahmad', battingRating: 20, bowlingRating: 80 },
      { name: 'Sai Sudharsan', battingRating: 80, bowlingRating: 10 },
    ]
  },
];

// BBL Teams
export const BBL_TEAMS: TeamData[] = [
  {
    name: 'Sydney Sixers', code: 'SIX', color: '#ff69b4', flag: '🩷',
    players: [
      { name: 'Moises Henriques', battingRating: 75, bowlingRating: 68 },
      { name: 'Josh Philippe', battingRating: 80, bowlingRating: 10 },
      { name: 'Daniel Hughes', battingRating: 72, bowlingRating: 10 },
      { name: 'Jordan Silk', battingRating: 70, bowlingRating: 10 },
      { name: 'Steve O\'Keefe', battingRating: 30, bowlingRating: 78 },
      { name: 'Ben Dwarshuis', battingRating: 25, bowlingRating: 78 },
      { name: 'Sean Abbott', battingRating: 30, bowlingRating: 80 },
      { name: 'Carlos Brathwaite', battingRating: 72, bowlingRating: 68 },
      { name: 'Tom Curran', battingRating: 65, bowlingRating: 75 },
      { name: 'Jack Edwards', battingRating: 68, bowlingRating: 55 },
      { name: 'Hayden Kerr', battingRating: 60, bowlingRating: 65 },
    ]
  },
  {
    name: 'Sydney Thunder', code: 'THU', color: '#00b140', flag: '🟢',
    players: [
      { name: 'David Warner', battingRating: 88, bowlingRating: 15 },
      { name: 'Alex Hales', battingRating: 83, bowlingRating: 10 },
      { name: 'Sam Billings', battingRating: 78, bowlingRating: 10 },
      { name: 'Daniel Sams', battingRating: 65, bowlingRating: 75 },
      { name: 'Chris Green', battingRating: 45, bowlingRating: 75 },
      { name: 'Nathan McAndrew', battingRating: 40, bowlingRating: 78 },
      { name: 'Brendan Doggett', battingRating: 20, bowlingRating: 72 },
      { name: 'Matthew Gilkes', battingRating: 72, bowlingRating: 10 },
      { name: 'Oliver Davies', battingRating: 70, bowlingRating: 40 },
      { name: 'Tanveer Sangha', battingRating: 25, bowlingRating: 75 },
      { name: 'Jason Sangha', battingRating: 68, bowlingRating: 10 },
    ]
  },
  {
    name: 'Melbourne Stars', code: 'STA', color: '#00a651', flag: '🟢',
    players: [
      { name: 'Glenn Maxwell', battingRating: 82, bowlingRating: 65 },
      { name: 'Marcus Stoinis', battingRating: 78, bowlingRating: 72 },
      { name: 'Joe Clarke', battingRating: 75, bowlingRating: 10 },
      { name: 'Hilton Cartwright', battingRating: 68, bowlingRating: 55 },
      { name: 'Adam Zampa', battingRating: 20, bowlingRating: 82 },
      { name: 'Trent Boult', battingRating: 25, bowlingRating: 88 },
      { name: 'Clint McKay', battingRating: 30, bowlingRating: 72 },
      { name: 'Brody Couch', battingRating: 20, bowlingRating: 70 },
      { name: 'Tom Rogers', battingRating: 25, bowlingRating: 72 },
      { name: 'Beau Webster', battingRating: 68, bowlingRating: 55 },
      { name: 'Nick Larkin', battingRating: 65, bowlingRating: 10 },
    ]
  },
  {
    name: 'Melbourne Renegades', code: 'REN', color: '#e8000d', flag: '🔴',
    players: [
      { name: 'Aaron Finch', battingRating: 83, bowlingRating: 10 },
      { name: 'Shaun Marsh', battingRating: 78, bowlingRating: 10 },
      { name: 'Nic Maddinson', battingRating: 75, bowlingRating: 10 },
      { name: 'Kane Richardson', battingRating: 30, bowlingRating: 80 },
      { name: 'Imad Wasim', battingRating: 65, bowlingRating: 75 },
      { name: 'Mohammad Nabi', battingRating: 68, bowlingRating: 78 },
      { name: 'Zak Evans', battingRating: 25, bowlingRating: 72 },
      { name: 'Josh Lalor', battingRating: 20, bowlingRating: 70 },
      { name: 'Sam Harper', battingRating: 70, bowlingRating: 10 },
      { name: 'Jake Fraser-McGurk', battingRating: 82, bowlingRating: 10 },
      { name: 'Will Sutherland', battingRating: 60, bowlingRating: 65 },
    ]
  },
  {
    name: 'Brisbane Heat', code: 'HEA', color: '#ff6600', flag: '🟠',
    players: [
      { name: 'Chris Lynn', battingRating: 82, bowlingRating: 10 },
      { name: 'Max Bryant', battingRating: 75, bowlingRating: 10 },
      { name: 'Jimmy Peirson', battingRating: 70, bowlingRating: 10 },
      { name: 'Marnus Labuschagne', battingRating: 88, bowlingRating: 45 },
      { name: 'Xavier Bartlett', battingRating: 30, bowlingRating: 78 },
      { name: 'Mark Steketee', battingRating: 25, bowlingRating: 75 },
      { name: 'Michael Neser', battingRating: 55, bowlingRating: 75 },
      { name: 'Matt Renshaw', battingRating: 72, bowlingRating: 10 },
      { name: 'Colin Munro', battingRating: 80, bowlingRating: 10 },
      { name: 'Mitch Swepson', battingRating: 20, bowlingRating: 75 },
      { name: 'Spencer Johnson', battingRating: 20, bowlingRating: 78 },
    ]
  },
  {
    name: 'Adelaide Strikers', code: 'STR', color: '#0066cc', flag: '🔵',
    players: [
      { name: 'Travis Head', battingRating: 85, bowlingRating: 40 },
      { name: 'Matt Short', battingRating: 78, bowlingRating: 55 },
      { name: 'Alex Carey', battingRating: 72, bowlingRating: 10 },
      { name: 'Peter Siddle', battingRating: 25, bowlingRating: 78 },
      { name: 'Rashid Khan', battingRating: 55, bowlingRating: 93 },
      { name: 'Wes Agar', battingRating: 25, bowlingRating: 75 },
      { name: 'Henry Hunt', battingRating: 70, bowlingRating: 10 },
      { name: 'Thomas Kelly', battingRating: 65, bowlingRating: 55 },
      { name: 'Harry Nielsen', battingRating: 60, bowlingRating: 10 },
      { name: 'Cameron Boyce', battingRating: 20, bowlingRating: 72 },
      { name: 'Ian Cockbain', battingRating: 72, bowlingRating: 10 },
    ]
  },
  {
    name: 'Hobart Hurricanes', code: 'HUR', color: '#9b1c31', flag: '🔴',
    players: [
      { name: 'Matthew Wade', battingRating: 78, bowlingRating: 10 },
      { name: 'D\'Arcy Short', battingRating: 80, bowlingRating: 65 },
      { name: 'Ben McDermott', battingRating: 78, bowlingRating: 10 },
      { name: 'Tim David', battingRating: 82, bowlingRating: 10 },
      { name: 'Riley Meredith', battingRating: 20, bowlingRating: 80 },
      { name: 'Joel Paris', battingRating: 20, bowlingRating: 75 },
      { name: 'Caleb Jewell', battingRating: 68, bowlingRating: 10 },
      { name: 'Asif Ali', battingRating: 75, bowlingRating: 10 },
      { name: 'Nathan Ellis', battingRating: 20, bowlingRating: 78 },
      { name: 'Wil Parker', battingRating: 55, bowlingRating: 60 },
      { name: 'Nikhil Chaudhary', battingRating: 25, bowlingRating: 72 },
    ]
  },
  {
    name: 'Perth Scorchers', code: 'SCO', color: '#f15a22', flag: '🟠',
    players: [
      { name: 'Ashton Turner', battingRating: 78, bowlingRating: 30 },
      { name: 'Josh Inglis', battingRating: 80, bowlingRating: 10 },
      { name: 'Cameron Bancroft', battingRating: 72, bowlingRating: 10 },
      { name: 'Andrew Tye', battingRating: 25, bowlingRating: 80 },
      { name: 'Jason Roy', battingRating: 83, bowlingRating: 10 },
      { name: 'Jhye Richardson', battingRating: 25, bowlingRating: 82 },
      { name: 'Ashton Agar', battingRating: 60, bowlingRating: 78 },
      { name: 'Mitchell Marsh', battingRating: 80, bowlingRating: 70 },
      { name: 'Nick Hobson', battingRating: 68, bowlingRating: 10 },
      { name: 'Aaron Hardie', battingRating: 70, bowlingRating: 65 },
      { name: 'Peter Hatzoglou', battingRating: 20, bowlingRating: 75 },
    ]
  },
];

// Domestic Teams
export const RANJI_TEAMS: TeamData[] = [
  { name: 'Mumbai', code: 'MUM', color: '#1a6bb5', flag: '🔵', players: generateDomesticPlayers('Mumbai') },
  { name: 'Delhi', code: 'DEL', color: '#003087', flag: '🔵', players: generateDomesticPlayers('Delhi') },
  { name: 'Karnataka', code: 'KAR', color: '#ff0000', flag: '🔴', players: generateDomesticPlayers('Karnataka') },
  { name: 'Tamil Nadu', code: 'TN', color: '#ff6600', flag: '🟠', players: generateDomesticPlayers('Tamil Nadu') },
  { name: 'Rajasthan', code: 'RAJ', color: '#e91e8c', flag: '🩷', players: generateDomesticPlayers('Rajasthan') },
  { name: 'Punjab', code: 'PUN', color: '#ed1b24', flag: '🔴', players: generateDomesticPlayers('Punjab') },
  { name: 'Bengal', code: 'BEN', color: '#3a225d', flag: '🟣', players: generateDomesticPlayers('Bengal') },
  { name: 'Uttar Pradesh', code: 'UP', color: '#006400', flag: '🟢', players: generateDomesticPlayers('Uttar Pradesh') },
];

export const SHEFFIELD_SHIELD_TEAMS: TeamData[] = [
  { name: 'New South Wales', code: 'NSW', color: '#003087', flag: '🔵', players: generateDomesticPlayers('NSW') },
  { name: 'Victoria', code: 'VIC', color: '#003087', flag: '🔵', players: generateDomesticPlayers('Victoria') },
  { name: 'Queensland', code: 'QLD', color: '#8b0000', flag: '🔴', players: generateDomesticPlayers('Queensland') },
  { name: 'South Australia', code: 'SA', color: '#ff0000', flag: '🔴', players: generateDomesticPlayers('South Australia') },
  { name: 'Western Australia', code: 'WA', color: '#f5a623', flag: '🟡', players: generateDomesticPlayers('Western Australia') },
  { name: 'Tasmania', code: 'TAS', color: '#9b1c31', flag: '🔴', players: generateDomesticPlayers('Tasmania') },
];

export const COUNTY_TEAMS: TeamData[] = [
  { name: 'Yorkshire', code: 'YOR', color: '#003087', flag: '🔵', players: generateDomesticPlayers('Yorkshire') },
  { name: 'Surrey', code: 'SUR', color: '#8b0000', flag: '🔴', players: generateDomesticPlayers('Surrey') },
  { name: 'Lancashire', code: 'LAN', color: '#ff0000', flag: '🔴', players: generateDomesticPlayers('Lancashire') },
  { name: 'Warwickshire', code: 'WAR', color: '#003087', flag: '🔵', players: generateDomesticPlayers('Warwickshire') },
  { name: 'Kent', code: 'KEN', color: '#f5a623', flag: '🟡', players: generateDomesticPlayers('Kent') },
  { name: 'Essex', code: 'ESS', color: '#003087', flag: '🔵', players: generateDomesticPlayers('Essex') },
  { name: 'Hampshire', code: 'HAM', color: '#003087', flag: '🔵', players: generateDomesticPlayers('Hampshire') },
  { name: 'Nottinghamshire', code: 'NOT', color: '#f5a623', flag: '🟡', players: generateDomesticPlayers('Nottinghamshire') },
];

function generateDomesticPlayers(teamName: string): PlayerData[] {
  const seed = teamName.charCodeAt(0) + teamName.charCodeAt(1);
  return Array.from({ length: 11 }, (_, i) => ({
    name: `${teamName} Player ${i + 1}`,
    battingRating: 60 + ((seed + i * 7) % 30),
    bowlingRating: i < 5 ? 20 + ((seed + i * 11) % 30) : 55 + ((seed + i * 13) % 30),
  }));
}

export function getFormatLabel(format: MatchFormat): string {
  switch (format) {
    case MatchFormat.t20: return 'T20';
    case MatchFormat.odi: return 'ODI';
    case MatchFormat.test: return 'Test';
  }
}

export function getFormatOvers(format: MatchFormat): number {
  switch (format) {
    case MatchFormat.t20: return 20;
    case MatchFormat.odi: return 50;
    case MatchFormat.test: return 90;
  }
}

export function getTournamentLabel(type: TournamentType): string {
  switch (type) {
    case TournamentType.ipl: return 'IPL';
    case TournamentType.bbl: return 'BBL';
    case TournamentType.ranjiTrophy: return 'Ranji Trophy';
    case TournamentType.sheffieldShield: return 'Sheffield Shield';
    case TournamentType.countyChampionship: return 'County Championship';
  }
}

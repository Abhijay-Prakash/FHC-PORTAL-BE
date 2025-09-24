import mongoose from 'mongoose';

export const SKILLS_ENUM = [
  'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'Material UI', 'JavaScript', 'Angular', 'React',
  'Node', 'Express', 'Java', 'Springboot', 'C', 'C++', 'Python', 'Django', 'Flask', 'FastAPI',
  'MVC Architecture', 'Microservices',
  'PostgreSQL', 'MongoDB', 'SQLite',
  'Machine Learning', 'Neural Networks', 'LLMs', 'Numpy', 'Pandas', 'Scikit-Learn',
  'OpenCv', 'TensorFlow', 'Keras', 'PyTorch', 'CNNs', 'YOLO',
  'Matplotlib', 'Seaborn', 'EDA', 'Feature Engineering',
  'Docker', 'Git', 'Github', 'Gitlab', 'CI/CD',
  'AWS S3', 'Amazon SageMaker', 'AWS EC2 (GPU)', 'AWS Lambda',
  'Amazon API Gateway', 'AWS Glue', 'AWS Step Functions',
  'Amazon Kinesis', 'AWS IAM', 'Amazon CloudWatch',
  'Amazon RDS', 'Amazon DynamoDB', 'Amazon Redshift',
  'AWS CodePipeline', 'AWS CloudFormation',
  'Amazon Lex', 'Amazon Rekognition', 'Amazon Comprehend',
  'Amazon Forecast', 'Amazon Translate', 'Amazon Textract',
  'Amazon EKS', 'Amazon ECS',
  'Azure Blob Storage', 'Azure Machine Learning', 'Azure Virtual Machines (GPU)', 'Azure Functions',
  'Azure API Management', 'Azure Data Factory', 'Azure Logic Apps', 'Azure Event Hubs',
  'Azure Active Directory', 'Azure Monitor', 'Azure Log Analytics',
  'Azure SQL Database', 'Azure Cosmos DB', 'Azure Synapse Analytics',
  'Azure DevOps Pipelines', 'Azure Resource Manager (ARM)',
  'Azure Bot Services', 'Azure Cognitive Services - Vision', 'Azure Cognitive Services - Language',
  'Azure Time Series Insights', 'Azure Translator', 'Azure Form Recognizer',
  'Azure Kubernetes Service (AKS)', 'Azure Container Instances (ACI)',
  'Arduino', 'Raspberry Pi', 'ESP32', 'Embedded C', 'Microcontrollers',
  'Sensor Interfacing', 'Serial Communication', 'I2C', 'SPI',
  'Bluetooth Communication', 'WiFi Communication', 'LoRa', 'Zigbee',
  'Basic Electronics', 'Circuit Design', 'PCB Design', 'Proteus Simulation', 'Fritzing',
  'IoT', 'Motor Drivers', 'Servo Control', 'Line Following Algorithm', 'Obstacle Avoidance', 'PID Control'
];





const userSchema = new mongoose.Schema({

  
  // Required fields at signup
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
  gender: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  class: {
    type: String,
    enum: ['CSA','CSB','CSC','CSD','EC','EI','EE','ME','CE','IMCA'],
    required: true,
  },
  membershipId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  role: {
    type: String,
    enum: ['participant', 'member', 'execom', 'admin'],
    default: 'participant',
  },
  
  // Optional ....required for entering into any project/teams 

  skills: [{
  type: String,
  enum: SKILLS_ENUM,
  required: false
  }],





  githubLink: {
    type: String,
  },
  linkedinLink: {
    type: String,
  },  



  // for event tracking
  eventsAttended: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
  eventsRegistered: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event'
  }],
}, {
  timestamps: true
});


userSchema.index({ eventsAttended: 1 });
userSchema.index({ eventsRegistered: 1 });

export default mongoose.model('User', userSchema);
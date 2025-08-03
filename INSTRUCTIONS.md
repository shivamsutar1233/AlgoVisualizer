# Algorithm Visualizer - Setup Instructions

## Project Setup

### Prerequisites
1. Install Node.js (v14.0.0 or higher)
2. Install a modern web browser
3. Text editor or IDE (VS Code recommended)

### Installation Steps
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server

## Project Structure

```
algovisualizer/
├── src/
│   ├── algorithms/
│   │   ├── sorting/
│   │   ├── pathfinding/
│   │   └── datastructures/
│   ├── components/
│   │   ├── ControlPanel/
│   │   ├── VisualizerCanvas/
│   │   └── InfoPanel/
│   ├── utils/
│   └── styles/
├── public/
└── tests/
```

## Development Guidelines

### Adding New Algorithms
1. Create a new file in the appropriate algorithm category folder
2. Implement the algorithm with proper visualization states
3. Add the algorithm to the main selection menu
4. Create corresponding visualization components
5. Add documentation and complexity analysis

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write unit tests for algorithms
- Comment complex logic
- Use meaningful variable names

### Visualization Guidelines
1. Use consistent colors for similar operations
2. Implement smooth animations
3. Provide clear state indicators
4. Add responsive design support
5. Include accessibility features

## Testing
1. Run unit tests: `npm test`
2. Test visualizations in different browsers
3. Verify algorithm correctness
4. Check responsive design
5. Validate accessibility

## Deployment
1. Build production version: `npm run build`
2. Test the production build locally
3. Deploy to hosting platform

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request
4. Follow code review process

## Support
- Check documentation in `/docs`
- Submit issues for bugs
- Join discussion forum
- Contact maintainers

import { AwesomeLibrary } from './AwesomeLibrary';

export class Sample {

  run(): void {
    const awesome = new AwesomeLibrary();
    console.log(awesome);
    console.log('Sample done');
  }
}

const sample = new Sample();
sample.run();

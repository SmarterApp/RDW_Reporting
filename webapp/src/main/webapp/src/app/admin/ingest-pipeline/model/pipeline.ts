export type InputType = 'xml' | 'json' | 'csv';

/**
 * Represents an ingest pipeline
 */
export interface Pipeline {
  /**
   * The pipeline identifier
   */
  id: number;

  /**
   * The pipeline code
   */
  code: string;

  /**
   * The pipeline input format
   * This can be XML, CSV etc.
   */
  inputType: InputType;

  /**
   * Version of the active pipeline
   */
  activeVersion?: number;

  /**
   * The pipeline script
   */
  script?: PipelineScript;

  /**
   * The pipeline tests
   */
  tests?: PipelineTest[];
}

export interface PublishedPipeline {
  pipelineId: number;
  version: number;
  userScripts: PipelineScript[];
  publishedOn: Date;
  publishedBy: string;
}

/**
 * Represents a script
 */
export interface Script {
  /**
   * The language the script is written in
   */
  language?: string;

  /**
   * The script code
   */
  body?: string;
}

export interface PipelineScript extends Script {
  /**
   * The script ID
   */
  id?: number;

  /**
   * The pipeline ID
   */
  pipelineId: number;

  /**
   * The user given script name
   */
  name?: string;

  /**
   * The script creation datetime
   */
  createdOn?: Date;

  /**
   * The script updated datetime
   */
  updatedOn?: Date;

  /**
   * The user who updated the script last
   */
  updatedBy?: string;
}

/**
 * Represents a pipeline test
 */
export interface PipelineTest {
  /**
   * The test entity ID
   */
  id?: number;

  /**
   * The pipeline ID
   */
  pipelineId: number;

  /**
   * The creation datetime
   */
  createdOn?: Date;

  /**
   * The datetime of the last update
   */
  updatedOn?: Date;

  /**
   * The last user to update the test
   */
  updatedBy?: string;

  /**
   * The user defined test name
   */
  name?: string;

  /**
   * The test input
   */
  input?: string;

  /**
   * The expected test output
   */
  output?: string;
}

/**
 * This can be a compilation error or a runtime script execution error
 */
export interface ScriptError {
  row: number;
  column: number;
  message: string;
}

export interface PipelineTestResult {
  /**
   * Indicates whether the test passed or not
   */
  passed: boolean;

  /**
   * The fatal runtime execution error if any
   */
  scriptErrors?: ScriptError[];

  /**
   * The actual test output if different than the expected output
   */
  output?: string;
}

export interface PipelineTestRun {
  /**
   * The test that was run
   */
  test: PipelineTest;

  /**
   * The results of the run test
   */
  result: PipelineTestResult;
}

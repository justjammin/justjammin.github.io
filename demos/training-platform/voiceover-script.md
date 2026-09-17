# Voice recording script

Record each numbered section as a separate take, or one continuous file with a short pause between sections. Read only the paragraphs, not the headings. Use your natural pace; the scene timings are provisional and will be adjusted to your audio. No need to race the clock. WAV or M4A is fine. No music is needed.

## 01 — THE TRAINING PLATFORM (0:00 target)

This project explores a practical training-platform problem: what happens when a worker fails halfway through a run?

I built a training platform that validates a configuration, trains a model, saves checkpoints, deliberately kills a worker, and verifies recovery.

The CPU workflow runs locally with PyTorch and Ray. A separate pretrained LoRA extension runs on Kaggle GPU compute. Databricks handles dataset preparation and reporting.

## 02 — DATA / VALIDATION (0:30 target)

The dataset is BANKING seventy-seven from Hugging Face, which contains banking questions across seventy-seven intent categories.

I pinned the dataset revision and verified its content hash. The prepared splits contain two thousand four hundred sixty-four training examples, one hundred fifty-four validation examples, and three thousand seventy-six test examples.

Before allocating a worker, the platform checks the configuration, dataset hash, and batch settings.

The CPU recording uses a tiny classifier to exercise the infrastructure. The separate GPU extension fine-tunes a pretrained language model with LoRA.

## 03 — RECORDED CPU / BASELINE (1:00 target)

First, I run an uninterrupted baseline.

This configuration completes twenty optimizer updates on a local CPU and saves a checkpoint every five updates. Runtime and retries are bounded.

The recording contains actual command output. The website replays that capture; it does not start a training job in your browser.

This baseline gives the recovery run a concrete reference for comparison.

## 04 — RECORDED CPU / FAULT INJECTION (1:30 target)

Next, I inject a real worker failure at update seven using sig-kill.

The run correctly reports failure. Its most recent complete checkpoint is update five.

Recovery restores more than the model weights. It restores the optimizer, learning-rate scheduler, random-number-generator state, and position in the training data.

The worker resumes from five, recomputes updates six and seven, and continues through twenty.

That means execution is at least once. The raw log preserves repeated updates, while the canonical view selects the latest attempt for each update.

## 05 — RECOVERY / FULL-STATE CHECK (2:15 target)

Finishing successfully is not enough to establish correct recovery.

I compare seven state fields against the uninterrupted baseline, using zero relative tolerance and an absolute tolerance of one times ten to the negative seven.

That comparison passes.

You can also see the recovery history directly: restoration at five, completion at twenty, twenty-two raw metric rows, and twenty canonical rows.

## 06 — EVALUATION / MEASURED LIMITS (2:45 target)

Evaluation uses the same fixed holdout, with paired predictions and per-class metrics. That makes model iteration traceable to a specific dataset, configuration and checkpoint.

I also tested two local Ray workers using PyTorch distributed training with Gloo, including recovery after a worker failure.

Those are separate measured runs. At this small scale, distributed execution was slower because setup and coordination outweighed the useful computation.

This benchmark gives me a measured starting point for sizing workloads before expanding to multiple hosts.

## 07 — DATABRICKS / EARLIER VERIFIED OUTPUT (3:15 target)

Databricks provides the data and reporting side.

I verified dataset preparation, Delta table writes and reads, artifact export, and result imports.

Each of eight run bundles was imported twice. The resulting tables contained zero duplicate-key groups.

Raw metrics retain retry history, and a canonical view supports comparison without double-counting repeated updates.

These results came from an executed Databricks notebook. The terminal recording does not rerun that cloud workflow.

## 08 — DESIGN / EVIDENCE / NEXT STEPS (3:45 target)

The architecture separates local CPU and GPU compute from Databricks reporting, transferring verified artifacts between them.

The linked FigJam board documents the system, decision records, and the training, recovery, and import flows.

The next deployment stage adds durable shared storage, managed job orchestration and operational monitoring, followed by multi-node load tests and host-loss recovery validation.

The result is a reproducible training platform with tested failure recovery, GPU fine-tuning and traceable evaluation.

The transcript, presenter steps, and measured results are available on the demo page.

## Additional take — VERIFIED GPU RECOVERY

This is a separate run on a Kaggle Tesla T-four GPU. It uses the pretrained Smol-L-M-two model with about one hundred thirty-five million parameters.

LoRA updates only four hundred sixty thousand eight hundred adapter parameters while keeping the base model frozen.

I first completed a two-update smoke test. Then I forced a real failure at update three, restored checkpoint two, and continued to update four.

The recovered checkpoint matched the uninterrupted reference across the complete saved state, with zero tensor difference.

Recovery correctness and model quality have separate checks. After the single-GPU recovery test, I compared the base model and adapter on the complete held-out set.

## Additional take — FULL GPU EVALUATION AND LIMITS

The main GPU experiment completed one hundred updates. Its first attempt hit a forty-five-minute deadline during evaluation, so I preserved that failure and restored the final training checkpoint.

After batching generation, the resumed evaluation completed all three thousand seventy-six test tickets without repeating training.

Macro F-one increased from zero to about zero point zero four nine. Ninety-six predictions improved and none regressed. But more than ninety-five percent of adapter responses were still invalid labels.

The evaluation exposed the next engineering problem: label generation. The prompt did not list all seventy-seven choices, and the base produced no exact valid labels. I would investigate that interface on validation data before the next held-out comparison.

I downloaded the reports and checkpoints, checked their hashes, and stopped the GPU session. Databricks then imported all four LoRA runs twice. Counts stayed at 111 raw metrics and 3,076 paired predictions, with 110 canonical metrics and zero duplicate keys.

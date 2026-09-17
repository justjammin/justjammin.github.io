# Training platform demonstration

Public demo: https://justjammin.github.io/demos/training-platform/

The page contains a timed terminal replay and written presenter steps. It does not launch training in visitors' browsers. No narrated screen video is claimed.

## Presenter sequence (approximately four minutes)

| Time | Action | Evidence to explain |
|---|---|---|
| 0:00–0:35 | Open the demo and select **Pin the data**. | Hugging Face BANKING77, pinned revision, hash, 2,464/154/3,076 splits. Exact normalized duplicates were audited; semantic paraphrase independence is unverified. |
| 0:35–1:00 | Select **Validate before allocating**, then **Run the baseline**. | Valid configuration, effective batch 8, bounded 20-update local CPU run. This is a tiny hash-feature MLP, not LoRA. |
| 1:00–1:45 | Select **Kill the worker**, then **Resume from durable state**. | Actual SIGKILL at update 7 produces failure; complete checkpoint 5 survives. Resume restores 5 and reaches 20. |
| 1:45–2:15 | Select **Prove recovery**. | Seven full-state fields match at `rtol=0, atol=1e-7`. Raw metrics contain 22 rows; canonical view has 20. Execution is at least once. |
| 2:15–2:45 | Select **Evaluate the holdout**, then inspect Results. | The lightweight baseline produced macro-F1 0.002908 → 0.012579. Earlier matched-batch Ray results are separate runs, on two CPU ranks on one host, and slower at this scale. |
| 2:45–3:20 | Read the Databricks evidence panel. | Previously verified Databricks: eight bundles imported twice, zero duplicate-key groups, 246 raw / 240 canonical metrics. Counts are selected transcribed output; this recording did not execute a new cloud job. |
| 3:20–4:00 | Show system design, flowchart links, and the production expansion roadmap. | Local compute and manual artifact transfer; keyed Delta MERGE; bounded retries. This CPU recording makes no GPU claim. Separate GPU evidence is described below; Kubernetes, multi-node, production-scale and host-loss recovery remain unproven. |

Playback supports play/pause, chapter selection, 1×/2×/4× speed and full-transcript view. The complete transcript is available without JavaScript. Download links provide the transcript, timed recording, selected measured evidence and this walkthrough. FigJam may require board permission; the public architecture is self-contained.

## Record a fresh local demonstration

From the repository root, use the tested environment and cached dataset:

```bash
.venv/bin/train-demo prepare-data --offline
.venv/bin/python scripts/record_demo.py
```

The recorder executes validation, uninterrupted training, one-shot worker failure and resume through the actual CLI. It compares final state and evaluates the fixed holdout through the Python API. It writes `artifacts/demo/recording.json`, `transcript.txt`, and outputs under `runs/`. The CLI runs are bounded by the existing configuration. Native process inspection is needed for the supervisor on macOS.

Actual recording on September 17, 2026: baseline `run-090fda28ddf7`, recovered `run-d9166c292dde`; restoration `[0,5]`, final update 20, comparison passed. Recording timestamps preserve elapsed wall time; player speed changes playback only. The earlier sandbox attempt emitted PyArrow sysctl warnings that broke a combined stdout/stderr parser before training. The recorder now handles those streams separately; `artifacts/demo/sandbox-attempt.json` preserves that unsuccessful attempt. Native execution passed (`native-command.log`).

Independent human label review remains open. A terminal replay does not satisfy a separate narrated-video requirement.

## Separate GPU demonstration

The original terminal replay remains a CPU recording. Present the new GPU evidence separately:

1. Open the Kaggle notebook and show the recorded T4 capability check and pinned model/data revisions.
2. Show the completed two-update smoke manifest: 460,800 trainable adapter parameters and 689,030,144 peak allocated CUDA bytes.
3. Open `artifacts/lora/kaggle-recovery/gpu-recovery-proof.json`: SIGKILL at update 3, checkpoint 2 restored, final update 4, zero maximum tensor difference from the uninterrupted reference.
4. Explain that the main experiment uses one GPU and recovery uses a separate GPU. This is not distributed GPU training.
5. Show the [GPU process flow](https://www.figma.com/board/eoP4XdovCYaknxMSlGQcIX?node-id=3-133), associated with ADR 006.

The 100-update training phase and full held-out evaluation are verified. Show macro-F1 0 → 0.049 alongside the 95.64% invalid adapter-label rate; evaluation identifies label generation as the next validation-driven improvement. Explain the first attempt’s 45-minute deadline and successful checkpoint-100 resume. LoRA-specific Databricks reporting passed repeated imports: 4 runs, 111 raw / 110 canonical metrics, 3,076 paired predictions and zero duplicate-key groups. The voice script includes an additional GPU recovery take; final audio is not recorded yet.

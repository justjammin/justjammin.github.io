# Kaggle fixture probe — 2026-09-28

The eight-case synthetic fixture ran with real model inference on a Kaggle
Tesla T4. This checks capture compatibility and the regression workflow; it is
not a human-reviewed gold evaluation or a general model-quality claim.

Notebook: [Model Regression Detector - Fixture GPU Probe](https://www.kaggle.com/code/justnami/model-regression-detector-fixture-gpu-probe).
Access follows the notebook's account permissions.

## Runtime and model identities

- Python 3.12.13; Torch 2.10.0+cu128; CUDA 12.8; Transformers 4.57.6.
- Generation: `Qwen/Qwen2.5-1.5B-Instruct`, revision `989aa7980e4cf806f80c7fef2b1adb7bc71aa306`.
- Advisory judge: `Qwen/Qwen2.5-3B-Instruct`, revision `aa8e72537993ba99e69dfaafa59ed015b17504d1`.
- Models loaded sequentially on `cuda:0`, automatic dtype, no quantization.
- Capture code: commit `48e1dd3`, plus the new `support-json-v2` prompt for probe v2.

## Preserved initial result

`probe-v1` used `support-v1` as its baseline. All eight baseline responses were
invalid under the JSON contract: the model emitted prose or Markdown fences.
Baseline accuracy was 0%, with no eligible summary judgments. The intentionally
weakened candidate produced valid JSON and scored 25%, so the relative gate
correctly returned PASS. That result does not imply acceptable baseline quality.
Original responses remain in the first capture; they were not repaired or relabeled.

The live probe also exposed an import failure on Python 3.12 caused by runtime
evaluation of an argparse type annotation. Commit `48e1dd3` fixes all four affected
registrations. The complete 34-test suite passed on Python 3.12.14 after the fix.

## Fresh JSON-contract probe

`probe-v2` used the new `support-json-v2` baseline and the unchanged
`support-demo-weakened` candidate, with the same model revisions and runtime.

| Measurement | Baseline | Candidate |
| --- | ---: | ---: |
| Correct classifications | 7/8 | 2/8 |
| Accuracy | 87.5% | 25% |
| Invalid responses | 0 | 0 |
| Execution errors / missing responses | 0 / 0 | 0 / 0 |
| Valid advisory judgments | 8 | 8 |
| Mean advisory summary score | 4.75/5 | 4.875/5 |

The accuracy drop was **62.5 percentage points**, producing **FAIL**.
Six cases regressed: fixture-01, fixture-02, fixture-03, fixture-05, fixture-06,
and fixture-07. Judge scores remain advisory and have not been human-calibrated.

Evidence bundle hashes:

- Baseline: `fdb05b11cc8a311f2a831cace8c3b263c996d8d8b08ccfab7c55c73f8c21ca55`
- Candidate: `9b33677dcaa642efdee16cbb1b996c40ddf8f3184769de776d2c775f6de21ef0`

Kaggle output paths: `mrd/probe-v1/`, `mrd/probe-v2/`,
`mrd/evidence-export.zip`, `mrd/evidence-export-v2.zip`, `mrd/model-lock.json`,
and `mrd/environment.json`. Both sessions contain immutable per-run manifests.

Human gold review, full-dataset capture, Databricks acceptance, and static Space
publication remain tracked in `mrd-dsa`.

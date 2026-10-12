<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Validation;

use Hedabkh\Backend\Http\HttpException;

class RequestValidator
{
    /**
     * Validate data against rules.
     * Rules format: ['field' => 'required|string|email|int|min:1|max:100|in:a,b,c']
     */
    public static function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $ruleStr) {
            $ruleList = explode('|', $ruleStr);
            $val = $data[$field] ?? null;

            foreach ($ruleList as $rule) {
                if ($rule === 'required') {
                    if ($val === null || $val === '' || (is_array($val) && empty($val))) {
                        $errors[$field][] = "The field [{$field}] is required.";
                        break;
                    }
                }

                if ($val === null) {
                    continue; // Optional field and not provided
                }

                if ($rule === 'string' && !is_string($val)) {
                    $errors[$field][] = "The field [{$field}] must be a string.";
                } elseif ($rule === 'int' && !is_numeric($val)) {
                    $errors[$field][] = "The field [{$field}] must be an integer.";
                } elseif ($rule === 'array' && !is_array($val)) {
                    $errors[$field][] = "The field [{$field}] must be an array.";
                } elseif ($rule === 'email' && (!is_string($val) || !filter_var($val, FILTER_VALIDATE_EMAIL))) {
                    $errors[$field][] = "The field [{$field}] must be a valid email address.";
                } elseif (str_starts_with($rule, 'in:')) {
                    $allowed = explode(',', substr($rule, 3));
                    if (!in_array((string)$val, $allowed, true)) {
                        $errors[$field][] = "The field [{$field}] must be one of: " . implode(', ', $allowed);
                    }
                } elseif (str_starts_with($rule, 'min:')) {
                    $min = (int) substr($rule, 4);
                    if (is_string($val)) {
                        if (mb_strlen($val) < $min) {
                            $errors[$field][] = "The field [{$field}] must be at least {$min} characters.";
                        }
                    } elseif (is_numeric($val) && (float)$val < $min) {
                        $errors[$field][] = "The field [{$field}] must be at least {$min}.";
                    }
                } elseif (str_starts_with($rule, 'max:')) {
                    $max = (int) substr($rule, 4);
                    if (is_string($val)) {
                        if (mb_strlen($val) > $max) {
                            $errors[$field][] = "The field [{$field}] may not be greater than {$max} characters.";
                        }
                    } elseif (is_numeric($val) && (float)$val > $max) {
                        $errors[$field][] = "The field [{$field}] may not be greater than {$max}.";
                    }
                }
            }
        }

        if (!empty($errors)) {
            $formattedDetails = [];
            foreach ($errors as $f => $errs) {
                $formattedDetails[] = ['field' => $f, 'message' => $errs[0]];
            }
            throw HttpException::unprocessableEntity('Validation failed for given request payload.', 'UNPROCESSABLE_ENTITY', $formattedDetails);
        }

        return $data;
    }
}

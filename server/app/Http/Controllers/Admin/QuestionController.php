<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\AnswerResource;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    // CRUD cho câu hỏi

    public function index(Request $request)
    {
        try {
            $questions = Question::with('answers')->latest('id')->paginate(10);

            if ($questions->isEmpty()) {
                return response()->json(['message' => 'Không có câu hỏi nào được tìm thấy.'], 404);
            }
            return QuestionResource::collection($questions);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }


    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'is_active' => 'boolean',
        ]);

        try {
            $data = $request->all();
            $data['is_active'] = $data['is_active'] ?? true;

            $question = Question::create($data);
            return new QuestionResource($question);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }


    public function show($id)
    {
        try {
            $question = Question::with('answers')->findOrFail($id);
            return new QuestionResource($question);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không tìm thấy câu hỏi này.'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'text' => 'required|string',
            'is_active' => 'boolean',
        ]);

        try {
            $question = Question::findOrFail($id);

            $data = $request->all();

            $data['is_active'] = $data['is_active'] ?? $question->is_active;

            $question->update($data);

            return new QuestionResource($question);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy câu hỏi với ID ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }



    public function destroy($id)
    {
        try {
            $question = Question::findOrFail($id);
            $question->delete();
            return response()->json(['message' => 'Câu hỏi đã được xóa thành công.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không tìm thấy câu hỏi này.'], 404);
        }
    }
    public function updateIsActive(Request $request, $id)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        try {
            $question = Question::findOrFail($id);

            $question->update(['is_active' => $request->is_active]);

            return new QuestionResource($question);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    // Crud Answers

    //get

    public function getAnswers($questionId)
    {
        try {
            $question = Question::with('answers')->findOrFail($questionId);

            return new QuestionResource($question);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy câu hỏi với ID: ' . $questionId], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }


    //create

    public function storeAnswer(Request $request, $questionId)
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        try {
            $question = Question::findOrFail($questionId);

            $answer = Answer::create([
                'text' => $request->text,
                'question_id' => $questionId,
            ]);

            return new AnswerResource($answer);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy câu hỏi với ID ' . $questionId], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }


    public function updateAnswer(Request $request, $id)
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        try {
            $answer = Answer::findOrFail($id);

            $answer->update($request->all());

            return new AnswerResource($answer);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy câu trả lời với ID ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }



    public function destroyAnswer($id)
    {
        try {
            $answer = Answer::findOrFail($id);
            $answer->delete();
            return response()->json(['message' => 'Câu trả lời đã được xóa thành công.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không tìm thấy câu trả lời với ID: ' . $id], 404);
        }
    }
}
